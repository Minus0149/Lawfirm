export function stripHtmlAndTruncate(html: string, maxLength: number): string {
    const strippedText = html.replace(/<[^>]+>/g, '');
    return strippedText.length > maxLength
      ? strippedText.slice(0, maxLength) + '...'
      : strippedText;
  }
  
  