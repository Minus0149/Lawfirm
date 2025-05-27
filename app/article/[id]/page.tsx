import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Advertisement } from "@/components/advertisement";
import { formatDate } from "@/lib/formatDate";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { ViewRecorder } from "@/components/view-recorder";
import { SocialShare } from "@/components/social-share";
import { TableOfContents } from "@/components/table-of-contents";
import { extractHeadings } from "@/lib/textUtils";
import { StyledArticleContent } from "@/components/styled-article-content";
import { ArticleSidebar } from "@/components/article-sidebar";
import { ArticleSocialShare } from "@/components/article-social-share";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { YouMayAlsoLike } from "@/components/you-may-also-like";
import { Clock, Eye, Share2 } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300; // Revalidate every 5 minutes

interface ArticlePageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
  });

  if (!article) {
    return {};
  }

  const ogImage =
    article.imageUrl || `${process.env.NEXT_PUBLIC_APP_URL}/og.png`;

  return {
    title: article.title,
    description: article.content.substring(0, 160),
    authors: [{ name: article.author?.name || "Unknown" }],
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 160),
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author?.name || "Unknown"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content.substring(0, 160),
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          name: true,
          imageFile: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  // Fetch related articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      AND: [
        { id: { not: params.id } },
        { status: "PUBLISHED" },
        article.category ? { categoryId: article.category.id } : {},
      ],
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  const headings = extractHeadings(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.content.substring(0, 160),
    image: article.imageUrl || `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author?.name || "Unknown",
    },
    publisher: {
      "@type": "Organization",
      name: "LexInvictus",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <ViewRecorder articleId={params.id} />
        <Advertisement position="TOP_BANNER" />

        {/* New layout: Social share on left, main content in middle, sidebar on right */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Social Share Sidebar - Left */}
          <aside className="hidden lg:block lg:w-16 xl:w-20 flex-shrink-0">
            <div className="sticky top-8">
              <ArticleSocialShare
                url={`${process.env.NEXT_PUBLIC_APP_URL}/article/${article.id}`}
                title={article.title}
                articleId={article.id}
                shares={article.shares}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:w-2/3 xl:w-3/4 flex-1 min-w-0">
            <article className="max-w-none">
              {/* Article Image with Overlay */}
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full rounded-lg overflow-hidden group mb-6 lg:mb-8">
                {article.imageUrl || article.imageFile ? (
                  <Image
                    src={
                      article.imageUrl ||
                      `data:image/jpeg;base64,${
                        Array.isArray(article.imageFile)
                          ? Buffer.from(article.imageFile).toString("base64")
                          : article.imageFile
                      }`
                    }
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No image available
                  </div>
                )}

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                {/* Category tag - Top Left */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium uppercase tracking-wider text-white border border-white/30 rounded">
                      {article.category.name.replace("_", " ")}
                    </span>
                  </div>
                )}

                {/* Article details - Bottom Left */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="space-y-2">
                    {/* Title */}
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Author and metadata */}
                    <div className="flex flex-col space-y-1">
                      <p className="text-white/90 text-sm">
                        by {article.author?.name || "Unknown Author"}
                      </p>

                      {/* Reading time, views, and shares */}
                      <div className="flex items-center space-x-4 text-white/80 text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {Math.ceil(
                              article.content.split(/\s+/).length / 200
                            )}{" "}
                            minute read
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-3 h-3" />
                          <span>{article.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table of Contents - Only render if there are headings */}
              {headings.length > 0 && <TableOfContents headings={headings} />}

              {/* Mobile Social Share - Only visible on mobile */}
              <div className="lg:hidden mb-6">
                <div className="flex justify-center">
                  <ArticleSocialShare
                    url={`${process.env.NEXT_PUBLIC_APP_URL}/article/${article.id}`}
                    title={article.title}
                    articleId={article.id}
                    shares={article.shares}
                  />
                </div>
              </div>

              <StyledArticleContent content={article.content} />

              {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 gap-4">
                <LikeButton
                  articleId={article.id}
                  initialLikes={article.likes}
                />
                <SocialShare
                  url={`${process.env.NEXT_PUBLIC_APP_URL}/article/${article.id}`}
                  title={article.title}
                  articleId={article.id}
                  initialShares={article.shares}
                />
              </div> */}
            </article>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <ArticleSidebar
                article={{
                  id: article.id,
                  title: article.title,
                  imageUrl: article.imageUrl,
                  imageFile: article.imageFile,
                  createdAt: article.createdAt,
                  views: article.views,
                  shares: article.shares,
                  content: article.content,
                  author: article.author,
                  category: article.category,
                }}
              />
            </div>
          </aside>
        </div>
        <div className="mt-4">
          {/* Newsletter Signup */}
          <NewsletterSignup />

          {/* You May Also Like Section */}
          <YouMayAlsoLike
            currentArticleId={article.id}
            categoryId={article.category?.id}
          />
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: { id: true },
    where: { status: "PUBLISHED" },
    take: 100, // Limit to the most recent 100 articles
  });

  return articles.map((article) => ({
    id: article.id,
  }));
}
