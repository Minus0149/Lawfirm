import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Advertisement } from '@/components/advertisement'
import { formatDate } from '@/lib/formatDate'
import { LikeButton } from '@/components/like-button'
import { ShareButton } from '@/components/share-button'
import { ViewRecorder } from '@/components/view-recorder'
import { SocialShare } from '@/components/social-share'
import { TableOfContents } from "@/components/table-of-contents"
import { extractHeadings } from "@/lib/textUtils"
import { StyledArticleContent } from "@/components/styled-article-content"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true } } }
  })

  if (!article) {
    notFound()
  }
  const headings = extractHeadings(article.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewRecorder articleId={params.id} />
      <Advertisement position="TOP_BANNER" />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <TableOfContents headings={headings} />
        </aside>
      <article className="max-w-3xl mx-auto md:w-3/4">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-600 mb-4">By {article?.author?.name} | {formatDate(new Date(article.createdAt.toString()))}</p>
        <div className="mb-8 relative h-96">
          {article.imageUrl || article.imageFile ? (
            <Image
              src={article.imageUrl || `data:image/jpeg;base64,${Array.isArray(article.imageFile) ? Buffer.from(article.imageFile).toString('base64') : article.imageFile}`}
              alt={article.title}
              fill
              className="object-cover rounded-none"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-none">
              No image available
            </div>
          )}
        </div>
        {/* <div
            className="mt-8"
            dangerouslySetInnerHTML={{
              __html: article.content.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, content) => {
                const id = content.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                return `<h${level} id="${id}">${content}</h${level}>`
              }),
            }}
          /> */}
        <StyledArticleContent content={article.content}/>
        <div className="flex justify-between items-center mt-8">
          <LikeButton articleId={article.id} initialLikes={article.likes} />
          <SocialShare url={`${process.env.NEXT_PUBLIC_APP_URL}/article/${article.id}`} title={article.title} articleId={article.id} initialShares={article.shares} />
        </div>
      </article>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: { id: true },
    where: { status: 'PUBLISHED' },
    take: 100 // Limit to the most recent 100 articles
  })

  return articles.map((article) => ({
    id: article.id,
  }))
}

