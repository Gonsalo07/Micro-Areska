import type { UserProfile } from '@auth/types/user-profile'

export const AUTH_COOKIE_NAME = 'areska_auth'
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export interface AuthCacheData {
  isAuthenticated: boolean
  profile: UserProfile
}

export function saveAuthCache(profile: UserProfile): void {
  try {
    const data: AuthCacheData = { isAuthenticated: true, profile }
    const encoded = encodeURIComponent(JSON.stringify(data))
    document.cookie = `${AUTH_COOKIE_NAME}=${encoded}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`
  } catch {}
}

export function clearAuthCache(): void {
  try {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
  } catch {}
}

export function parseAuthCookie(cookieValue: string | undefined): AuthCacheData | null {
  if (!cookieValue) return null
  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch {
    return null
  }
}

export function readAuthCookie(): AuthCacheData | null {
  if (typeof document === 'undefined') return null
  try {
    const prefix = `${AUTH_COOKIE_NAME}=`
    const cookie = document.cookie.split('; ').find((c) => c.startsWith(prefix))
    if (!cookie) return null
    return parseAuthCookie(cookie.substring(prefix.length))
  } catch {
    return null
  }
}
