import { cn } from "@/lib/utils";

interface StyledLegalContentProps {
  content: string;
  className?: string;
}

export function StyledLegalContent({
  content,
  className,
}: StyledLegalContentProps) {
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
        "prose-img:rounded-md prose-img:w-96 prose-img:h-64 prose-img:object-contain prose-img:object-center prose-img:my-4 prose-img:mx-auto",
        "prose-code:text-gray-900 dark:prose-code:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1",
        "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100",
        "prose-small:text-gray-600 dark:prose-small:text-gray-300",
        "prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-300",
        "prose-li:text-gray-800 dark:prose-li:text-gray-200",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
