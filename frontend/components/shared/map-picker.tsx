'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertCircle, CheckCircle2, MapPin, Search } from 'lucide-react'

declare global {
  interface Window {
    google: any
    initGoogleMapsPicker?: () => void
  }
}

export interface MapPickerAddressComponents {
  street: string
  district: string
  city: string
  state: string
  zipCode: string
  fullAddress: string
}

interface MapPickerProps {
  initialLat?: number
  initialLng?: number
  onLocationSelect: (lat: number, lng: number, components: MapPickerAddressComponents) => void
}

const LIMA_CENTER = { lat: -12.0464, lng: -77.0428 }
const LIMA_BOUNDS = { north: -11.6, south: -12.55, east: -76.6, west: -77.35 }

function parseAddressComponents(place: any): MapPickerAddressComponents {
  const get = (type: string) =>
    place.address_components?.find((c: any) => c.types.includes(type))?.long_name ?? ''

  const streetNumber = get('street_number')
  const route = get('route')
  const sublocality = get('sublocality_level_1') || get('sublocality') || get('neighborhood')
  const locality = get('locality')
  const adminLevel2 = get('administrative_area_level_2')
  const adminLevel1 = get('administrative_area_level_1')
  const postalCode = get('postal_code')

  const street = [route, streetNumber].filter(Boolean).join(' ') || sublocality || locality

  return {
    street,
    district: sublocality || locality || '',
    city: adminLevel2 || 'Lima',
    state: adminLevel1 || 'Lima',
    zipCode: postalCode || 'Lima 1',
    fullAddress: place.formatted_address ?? street,
  }
}

function isInLima(components: MapPickerAddressComponents): boolean {
  return components.state.toLowerCase().includes('lima')
}

export function MapPicker({ initialLat, initialLng, onLocationSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const geocoderRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [outsideLima, setOutsideLima] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    if (!apiKey) {
      queueMicrotask(() => setIsLoading(false))
      return
    }

    const reverseGeocode = (lat: number, lng: number) => {
      if (!geocoderRef.current) return
      geocoderRef.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status !== 'OK' || !results?.[0]) return
        const components = parseAddressComponents(results[0])
        if (!isInLima(components)) {
          setOutsideLima(true)
          setSelectedAddress(null)
          mapInstanceRef.current?.panTo(LIMA_CENTER)
          markerRef.current?.setVisible(false)
          return
        }
        setOutsideLima(false)
        setSelectedAddress(components.fullAddress)
        onLocationSelect(lat, lng, components)
      })
    }

    const initAutocomplete = (
      mapInstance: any,
      placeMarkerFn: (lat: number, lng: number) => void
    ) => {
      if (!inputRef.current || !window.google?.maps?.places) return

      const bounds = new window.google.maps.LatLngBounds(
        { lat: LIMA_BOUNDS.south, lng: LIMA_BOUNDS.west },
        { lat: LIMA_BOUNDS.north, lng: LIMA_BOUNDS.east }
      )

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds,
        strictBounds: false,
        componentRestrictions: { country: 'pe' },
        fields: ['geometry', 'formatted_address', 'address_components'],
        types: ['address'],
      })
      autocompleteRef.current = ac

      ac.addListener('place_changed', () => {
        const place = ac.getPlace()
        if (!place?.geometry?.location) return

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const components = parseAddressComponents(place)

        if (!isInLima(components)) {
          setOutsideLima(true)
          setSelectedAddress(null)
          return
        }

        setOutsideLima(false)
        placeMarkerFn(lat, lng)
        mapInstance.panTo({ lat, lng })
        mapInstance.setZoom(16)
        setSelectedAddress(components.fullAddress)
        onLocationSelect(lat, lng, components)
      })
    }

    const initMapAndAutocomplete = () => {
      if (!mapRef.current || isInitializedRef.current) return
      isInitializedRef.current = true

      const center = initialLat && initialLng ? { lat: initialLat, lng: initialLng } : LIMA_CENTER

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      })
      mapInstanceRef.current = map
      geocoderRef.current = new window.google.maps.Geocoder()

      const marker = new window.google.maps.Marker({
        map,
        draggable: true,
        visible: !!(initialLat && initialLng),
        position: center,
        animation: window.google.maps.Animation.DROP,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
      })
      markerRef.current = marker

      const localPlaceMarker = (lat: number, lng: number) => {
        marker.setPosition({ lat, lng })
        marker.setVisible(true)
      }

      if (initialLat && initialLng) reverseGeocode(initialLat, initialLng)

      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        localPlaceMarker(lat, lng)
        reverseGeocode(lat, lng)
      })

      marker.addListener('dragend', (e: any) => {
        reverseGeocode(e.latLng.lat(), e.latLng.lng())
      })

      initAutocomplete(map, localPlaceMarker)
      setIsLoading(false)
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (window.google?.maps) {
      initMapAndAutocomplete()
    } else if (!existing) {
      window.initGoogleMapsPicker = initMapAndAutocomplete
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsPicker`
      script.async = true
      script.defer = true
      script.id = 'google-maps-picker-script'
      document.head.appendChild(script)
    } else {
      const wait = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(wait)
          initMapAndAutocomplete()
        }
      }, 100)
      return () => clearInterval(wait)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      {/* Buscador con autocomplete de Google */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder="Busca tu dirección en Lima..."
          className="w-full rounded-md border bg-background pl-9 pr-4 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        />
      </div>

      {/* Mapa */}
      <div className="relative rounded-lg overflow-hidden border" style={{ height: '320px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse z-10 rounded-lg">
            <MapPin className="size-6 text-muted-foreground animate-bounce" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Feedback */}
      {outsideLima && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>Solo se aceptan direcciones dentro del departamento de Lima.</span>
        </div>
      )}
      {selectedAddress && !outsideLima && (
        <div className="flex items-start gap-2 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-green-500 mt-0.5" />
          <span className="text-muted-foreground">{selectedAddress}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Busca tu dirección o haz clic en el mapa · Solo Lima
      </p>
    </div>
  )
}
