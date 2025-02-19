import { cn } from "@/lib/utils"

interface StyledLegalContentProps {
  content: string
  className?: string
}

export function StyledLegalContent({ content, className }: StyledLegalContentProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:text-primary",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground",
        "prose-ul:list-disc prose-ul:pl-5",
        "prose-ol:list-decimal prose-ol:pl-5",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-code:text-primary prose-code:bg-muted prose-code:rounded prose-code:px-1",
        "prose-pre:bg-muted prose-pre:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

