/**
 * Returns the MIME type string for an avatar output format.
 */
export function getMimeType(
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'avif',
): string {
  switch (format) {
    case 'svg':
      return 'image/svg+xml';
    case 'png':
    case 'jpeg':
    case 'webp':
    case 'avif':
      return `image/${format}`;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
