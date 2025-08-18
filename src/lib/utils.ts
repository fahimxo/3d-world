import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMimeType(base64) {
  if (base64.startsWith('iVBORw0K')) return 'image/png';
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('R0lGODlh') || base64.startsWith('R0lGODdh'))
    return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  if (base64.startsWith('PHN2Zy')) return 'image/svg+xml';
  return 'application/octet-stream'; // ناشناخته
}
