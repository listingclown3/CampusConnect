import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Combine class names with Tailwind CSS merge support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format.
 * Examples: "Aug 25, 2024", "Sep 1, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date string to time format.
 * Examples: "5:00 PM", "10:30 AM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
}

/**
 * Format a date as relative time.
 * Examples: "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get initials from a name string.
 * Examples: "John Doe" -> "JD", "Aisha" -> "A"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
