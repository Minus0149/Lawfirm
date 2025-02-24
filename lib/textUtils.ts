export function stripHtmlAndTruncate(html: string, maxLength: number): string {
  const strippedText = html.replace(/<[^>]+>/g, '');
  return strippedText.length > maxLength
    ? strippedText.slice(0, maxLength) + '...'
    : strippedText;
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /<h([1-6])(?:[^>]*\sid=["']([^"']*)["'])?[^>]*>([\s\S]*?)<\/h\1>/g;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = Number.parseInt(match[1]);
    const id = match[2]?.trim(); // Extract `id` if present
    const innerContent = match[3]
      .replace(/<[^>]+>/g, " ") // Remove HTML tags, keeping spaces
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    const finalId = id || innerContent.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    headings.push({ id: finalId, text: innerContent, level });
  }

  return headings;
}
