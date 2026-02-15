import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.trim() || ''
  const last = lastName?.trim() || ''
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase()
}
