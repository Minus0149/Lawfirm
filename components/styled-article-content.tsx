import { cn } from "@/lib/utils";

interface StyledArticleContentProps {
  content: string;
  className?: string;
}

export function StyledArticleContent({
  content,
  className,
}: StyledArticleContentProps) {
  return (
    <div
      className={cn(
        "prose max-w-none text-gray-900 dark:text-white",
        "prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white",
        "prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed",
        "prose-a:text-gray-900 dark:prose-a:text-white prose-a:no-underline hover:prose-a:underline hover:prose-a:text-gray-700 dark:hover:prose-a:text-gray-300",
        "prose-strong:text-gray-900 dark:prose-strong:text-white",
        "prose-ul:list-disc prose-ul:pl-5 prose-ul:text-gray-800 dark:prose-ul:text-gray-200",
        "prose-ol:list-decimal prose-ol:pl-5 prose-ol:text-gray-800 dark:prose-ol:text-gray-200",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-500 dark:prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
        "prose-img:rounded-md",
        "prose-code:text-gray-900 dark:prose-code:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1",
        "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100",
        "prose-small:text-gray-600 dark:prose-small:text-gray-300",
        "prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-300",
        "prose-li:text-gray-800 dark:prose-li:text-gray-200",
        className
      )}
      dangerouslySetInnerHTML={{
        __html: content
          // ✅ Remove all inline `style` attributes
          .replace(/\s*style="[^"]*"/g, "")
          // ✅ Add ID and Font Size Classes to Headings (`h1-h6`)
          .replace(
            /<h([1-6])([^>]*)>(.*?)<\/h\1>/g,
            (match, level, attrs, innerContent) => {
              const plainText = innerContent.replace(/<[^>]+>/g, "").trim();
              const id = plainText.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              // Tailwind Font Sizes for Different Headings
              const headingSizeClasses: Record<string, string> = {
                // "1": "text-4xl font-bold",  // h1
                "2": "text-4xl font-semibold text-gray-900 dark:text-white", // h2
                "3": "text-3xl font-semibold text-gray-900 dark:text-white", // h3
                "4": "text-2xl font-medium text-gray-900 dark:text-white", // h4
                "5": "text-xl font-medium text-gray-900 dark:text-white", // h5
                "6": "text-lg font-medium text-gray-900 dark:text-white", // h6
              };

              const headingClass =
                headingSizeClasses[level] ||
                "text-lg text-gray-900 dark:text-white";

              return `<h${level} id="${id}" class="${headingClass}">${innerContent}</h${level}>`;
            }
          ),
      }}
    />
  );
}
