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
        "prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-900 dark:text-white",
        "prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white",
        "prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-tight",
        "prose-a:text-gray-900 dark:prose-a:text-white prose-a:no-underline hover:prose-a:underline hover:prose-a:text-gray-700 dark:hover:prose-a:text-gray-300",
        "prose-strong:text-gray-900 dark:prose-strong:text-white",
        "prose-ul:list-none prose-ul:pl-0 prose-ul:text-gray-800 dark:prose-ul:text-gray-200",
        "prose-ol:list-decimal prose-ol:pl-5 prose-ol:text-gray-800 dark:prose-ol:text-gray-200",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-500 dark:prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
        "prose-img:rounded-md prose-img:w-full prose-img:max-w-full prose-img:h-96 sm:prose-img:h-56 md:prose-img:h-96 prose-img:object-contain prose-img:object-center prose-img:my-4 prose-img:mx-auto",
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
          )
          // ✅ Replace unordered list items with custom checkmark
          .replace(/<ul([^>]*)>/g, '<ul$1 class="space-y-2 mb-4">')
          .replace(
            /<li([^>]*)>/g,
            '<li$1 class="flex items-start"><span class="inline-flex items-center justify-center w-3 h-3 mt-1.5 md:mt-2.5 mr-3 flex-shrink-0"><svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2998 0.800049L4.4998 7.60005L1.6998 4.80005L0.299805 6.20005L4.4998 10.4L12.6998 2.20005L11.2998 0.800049Z" fill="#01CA6C"/></svg></span><span>'
          )
          .replace(/<\/li>/g, "</span></li>"),
      }}
    />
  );
}
