import React from 'react';
import Image from 'next/image';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bufferToBase64 } from '@/lib/utils';
import { StyledArticleContent } from './styled-article-content';

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {article.imageUrl || article.imageFile ? (
          <div className="relative h-96 w-full mb-4">
            <Image
              src={article.imageUrl || `data:image/jpeg;base64,${article.imageFile instanceof Uint8Array ? bufferToBase64(article.imageFile) : article.imageFile}`}
              alt={article.title}
              fill
              style={{ objectFit: 'contain' }}
              loading="lazy"
              className='h-full'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
            No image available
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          By {article.author?.name ?? 'Unknown author'} | {formatDate(new Date(article.createdAt))} | Category: {article.category?.name ?? 'Unknown category'}
        </p>
        <StyledArticleContent content={article.content} className="line-clamp-4" />
      </CardContent>
    </Card>
  );
}

