// Simple html to text conversion
export function htmlToText(html: string): string {
  if (!html) return "";
  return (
    html
      // Replace links
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi, "$2 ($1)")
      // Replace images
      .replace(
        /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
        "[$2] ($1)"
      )
      .replace(
        /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi,
        "[$1] ($2)"
      )
      .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, "[image] ($1)")
      // Replace videos
      .replace(/<video[^>]*src=["']([^"']*)["'][^>]*>/gi, "[video] ($1)")
      .replace(/<source[^>]*src=["']([^"']*)["'][^>]*>/gi, "[video] ($1)")
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
