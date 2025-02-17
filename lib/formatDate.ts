export function formatDate(date: Date | null | undefined): string {
  if (!date || isNaN(new Date(date).getTime())) { // Check if date is invalid
    return 'N/A';
  }
  return new Date(date).toLocaleDateString('en-US', { // Convert to Date object before formatting
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
 }
 
 