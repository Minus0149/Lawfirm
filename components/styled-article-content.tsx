import { cn } from "@/lib/utils"

interface StyledArticleContentProps {
  content: string
  className?: string
}

export function StyledArticleContent({ content, className }: StyledArticleContentProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:text-primary dark:prose-headings:text-primary-foreground",
        "prose-p:text-muted-foreground prose-p:leading-relaxed dark:prose-p:text-muted-foreground/80",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-500",
        "prose-strong:text-foreground dark:prose-strong:text-foreground",
        "prose-ul:list-disc prose-ul:pl-5 dark:prose-ul:text-muted-foreground/80",
        "prose-ol:list-decimal prose-ol:pl-5 dark:prose-ol:text-muted-foreground/80",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic dark:prose-blockquote:border-primary-foreground dark:prose-blockquote:text-muted-foreground/80",
        "prose-img:rounded-md",
        "prose-code:text-primary prose-code:bg-muted prose-code:rounded prose-code:px-1 dark:prose-code:text-primary-foreground dark:prose-code:bg-muted",
        "prose-pre:bg-muted prose-pre:text-foreground dark:prose-pre:bg-muted dark:prose-pre:text-foreground",
        "prose-small:text-muted-foreground dark:prose-small:text-muted-foreground/80",
        "prose-figcaption:text-muted-foreground dark:prose-figcaption:text-muted-foreground/80",
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: content
          // ✅ Remove all inline `style` attributes
          .replace(/\s*style="[^"]*"/g, "")
          // ✅ Add ID and Font Size Classes to Headings (`h1-h6`)
          .replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/g, (match, level, attrs, innerContent) => {
            const plainText = innerContent.replace(/<[^>]+>/g, "").trim()
            const id = plainText.toLowerCase().replace(/[^a-z0-9]+/g, "-")

            // Tailwind Font Sizes for Different Headings
            const headingSizeClasses: Record<string, string> = {
              // "1": "text-4xl font-bold",  // h1
              "2": "text-4xl font-semibold",  // h2
              "3": "text-3xl font-semibold",  // h3
              "4": "text-2xl font-medium",  // h4
              "5": "text-xl font-medium",  // h5
              "6": "text-lg font-medium",  // h6
            }

            const headingClass = headingSizeClasses[level] || "text-lg"

            return `<h${level} id="${id}" class="${headingClass}">${innerContent}</h${level}>`
          }),
      }}
    />
  )
}
