export function getGoogleMapsApiKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
    undefined
  )
}
