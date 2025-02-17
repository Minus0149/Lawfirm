import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serverPusher } from '@/lib/pusher';
import { EventEmitter } from 'events';
import { safelyIncreaseMaxListeners } from '@/lib/eventEmitterUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const globalEmitter = new EventEmitter();
safelyIncreaseMaxListeners(globalEmitter);

// This function is now internal to this file and not exported
function emitUpdate(data: any) {
  globalEmitter.emit('update', data);
  serverPusher.trigger('news-updates', 'update', data);
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  if (req.signal.aborted) {
    console.log('Request aborted before sending initial data.');
    return new Response('Request aborted', { status: 400 });
  }

  let isStreamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        try {
          if (!isStreamClosed) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          }
        } catch (error) {
          console.error('Error sending event:', error);
        }
      };

      const sendDashboardUpdates = async () => {
        try {
          const [articlesCount, usersCount, pendingArticlesCount, totalViews, totalAds, totalShares, 
            // totalLikes
          ] = await Promise.all([
            prisma.article.count(),
            prisma.user.count(),
            prisma.article.count({ where: { status: 'PENDING' } }),
            prisma.article.aggregate({ _sum: { views: true } }),
            prisma.advertisement.count(),
            prisma.article.aggregate({ _sum: { shares: true } }),
            // prisma.articleLike.count(),
          ]);

          sendEvent({
            type: 'dashboardUpdate',
            data: {
              articlesCount,
              usersCount,
              pendingArticlesCount,
              totalViews: totalViews._sum.views || 0,
              totalAds,
              totalShares: totalShares._sum.shares || 0,
              // totalLikes
            },
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      const sendLatestArticles = async () => {
        try {
          const latestArticles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { author: true },
          });

          const articlesWithAuthor = latestArticles.map(article => ({
            ...article,
            author: article.author || { id: 'N/A', name: 'Unknown Author', role: 'USER' },
          }));

          sendEvent({ type: 'latestArticles', articles: articlesWithAuthor });
        } catch (error) {
          console.error('Error fetching latest articles:', error);
        }
      };

      const sendLatestUsers = async () => {
        try {
          const latestUsers = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, name: true, email: true, role: true, createdAt: true },
          });

          sendEvent({ type: 'latestUsers', users: latestUsers });
        } catch (error) {
          console.error('Error fetching latest users:', error);
        }
      };

      try {
        await sendDashboardUpdates();
        await sendLatestArticles();
        await sendLatestUsers();
      } catch (error) {
        console.error('Error sending initial data:', error);
        controller.error(error);
        return;
      }

      const interval = setInterval(async () => {
        if (req.signal.aborted || isStreamClosed) {
          clearInterval(interval);
          if (!isStreamClosed) {
            isStreamClosed = true;
            controller.close();
          }
          return;
        }

        await sendDashboardUpdates();
        await sendLatestArticles();
        await sendLatestUsers();
      }, 5000); // Poll every 5 seconds

      // Listen for custom events
      const listener = (data: any) => {
        sendEvent(data);
      };
      globalEmitter.on('update', listener);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        globalEmitter.off('update', listener);
        if (!isStreamClosed) {
          isStreamClosed = true;
          controller.close();
        }
      });
    },
    cancel() {
      console.log('Stream cancelled');
      isStreamClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

