export function stripHtmlAndTruncate(html: string, maxLength: number): string {
    const strippedText = html.replace(/<[^>]+>/g, '');
    return strippedText.length > maxLength
      ? strippedText.slice(0, maxLength) + '...'
      : strippedText;
  }
  

  export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/g
    const headings: { id: string; text: string; level: number }[] = []
    let match
  
    while ((match = headingRegex.exec(content)) !== null) {
      const level = Number.parseInt(match[1])
      const text = match[2].replace(/<[^>]+>/g, "").trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      headings.push({ id, text, level })
    }
  
    return headings
  }
  
  