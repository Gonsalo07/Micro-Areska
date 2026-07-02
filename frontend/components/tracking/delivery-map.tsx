'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { MapPin, Navigation, Truck, User } from 'lucide-react'

import type { OrderDeliveryDetail } from '@public/api/delivery'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { type DeliveryLocationUpdate, useWebSocketTracking } from '@/hooks/use-websocket-tracking'
import { getGoogleMapsApiKey } from '@/lib/google-maps'

declare global {
  interface Window {
    google: any
  }
}

interface DeliveryMapProps {
  delivery: OrderDeliveryDetail | null
}

export function DeliveryMap({ delivery }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const driverMarkerRef = useRef<any>(null)
  const destinationMarkerRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const isInitializedRef = useRef(false)
  const hasInitialFitRef = useRef(false)
  const [distance, setDistance] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [currentDriverLocation, setCurrentDriverLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const onLocationUpdateRef = useRef((update: DeliveryLocationUpdate) => {
    console.log('Nueva ubicación del delivery recibida:', update)
    setCurrentDriverLocation({ lat: update.latitude, lng: update.longitude })
    if (update.estimatedDistance) setDistance(update.estimatedDistance)
    if (update.estimatedDuration) setDuration(update.estimatedDuration)
  })

  const onLocationUpdateStable = useCallback((update: DeliveryLocationUpdate) => {
    onLocationUpdateRef.current(update)
  }, [])

  const { isConnected } = useWebSocketTracking({
    orderId: delivery?.orderId,
    enabled: !!delivery && ['OUT_FOR_DELIVERY', 'ARRIVED'].includes(delivery.status),
    onLocationUpdate: onLocationUpdateStable,
  })

  useEffect(() => {
    console.log(
      'Estado WebSocket - Conectado:',
      isConnected,
      '| Orden:',
      delivery?.orderId,
      '| Estado:',
      delivery?.status
    )
  }, [isConnected, delivery?.orderId, delivery?.status])

  useEffect(() => {
    if (!delivery || !mapRef.current || isInitializedRef.current) {
      return
    }

    console.log('🗺️ Inicializando mapa por primera vez - Delivery:', {
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      driverName: delivery.driverName,
      hasDriverLocation: !!(delivery.driverCurrentLat && delivery.driverCurrentLng),
      driverLocation: delivery.driverCurrentLat
        ? {
            lat: delivery.driverCurrentLat,
            lng: delivery.driverCurrentLng,
          }
        : null,
    })

    isInitializedRef.current = true

    const apiKey = getGoogleMapsApiKey()

    if (!apiKey) {
      console.warn(
        'Google Maps API key no configurada. Define NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local'
      )
      return
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)

    if (!window.google && !existingScript) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.id = 'google-maps-script'
      document.head.appendChild(script)
    } else if (window.google) {
      initMap()
    }

    function initMap() {
      if (!mapRef.current || !window.google || !delivery) return

      const clientLocation = {
        lat: delivery.destinationLat || 19.4326,
        lng: delivery.destinationLng || -99.1332,
      }

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: clientLocation,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      })

      directionsServiceRef.current = new window.google.maps.DirectionsService()
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#4F46E5',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      })

      destinationMarkerRef.current = new window.google.maps.Marker({
        position: clientLocation,
        map: mapInstanceRef.current,
        title: 'Tu ubicación: ' + (delivery.destinationAddress || 'Destino'),
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
        animation: window.google.maps.Animation.DROP,
      })

      console.log('Marcador del cliente creado en:', clientLocation)

      if (delivery.driverCurrentLat && delivery.driverCurrentLng) {
        setCurrentDriverLocation({
          lat: delivery.driverCurrentLat,
          lng: delivery.driverCurrentLng,
        })
      }
    }

    return () => {
      console.log('Limpiando mapa')

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null)
        driverMarkerRef.current = null
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null)
        destinationMarkerRef.current = null
      }

      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
        directionsRendererRef.current = null
      }

      directionsServiceRef.current = null
      isInitializedRef.current = false
      mapInstanceRef.current = null
    }
  }, [delivery?.id])

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !delivery || !currentDriverLocation) return

    const driverLocation = currentDriverLocation
    const clientLocation = {
      lat: delivery.destinationLat || 19.4326,
      lng: delivery.destinationLng || -99.1332,
    }

    console.log('Actualizando ubicación del repartidor:', driverLocation)

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new window.google.maps.Marker({
        position: driverLocation,
        map: mapInstanceRef.current,
        title: 'Repartidor: ' + (delivery.driverName || 'En camino'),
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
        zIndex: 1000,
      })
    } else {
      driverMarkerRef.current.setPosition(driverLocation)
    }

    if (!hasInitialFitRef.current) {
      hasInitialFitRef.current = true
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(driverLocation)
      bounds.extend(clientLocation)
      mapInstanceRef.current.fitBounds(bounds)

      const mapInstance = mapInstanceRef.current
      if (mapInstance) {
        window.google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
          if (mapInstance) {
            const currentZoom = mapInstance.getZoom()
            if (currentZoom && currentZoom > 15) {
              mapInstance.setZoom(15)
            }
          }
        })
      }
    }

    if (directionsServiceRef.current && typeof directionsServiceRef.current.route === 'function') {
      console.log('Trazando ruta desde repartidor hasta tu ubicación')

      try {
        directionsServiceRef.current.route(
          {
            origin: driverLocation,
            destination: clientLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === 'OK' && result) {
              directionsRendererRef.current?.setDirections(result)

              const route = result.routes[0]
              if (route && route.legs[0]) {
                setDistance(route.legs[0].distance.text)
                setDuration(route.legs[0].duration.text)
                console.log(
                  'Ruta calculada:',
                  route.legs[0].distance.text,
                  route.legs[0].duration.text
                )
              }
            } else {
              console.error('Error al calcular ruta:', status)
            }
          }
        )
      } catch (error) {
        console.error('Error al llamar DirectionsService:', error)
      }
    }
  }, [currentDriverLocation, delivery])

  if (!delivery) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-muted/30">
        <div className="text-center text-muted-foreground">
          <MapPin className="mx-auto mb-3 size-12 opacity-50" />
          <p className="text-sm">No hay información de entrega disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col overflow-hidden">
      {isConnected && (
        <div className="border-b bg-muted/40 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Tracking en tiempo real activo
            </span>
          </div>
        </div>
      )}

      {distance && duration && (
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Navigation className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">En camino</span>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xs text-muted-foreground">Distancia</p>
                <p className="text-sm font-semibold">{distance}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiempo aprox.</p>
                <p className="text-sm font-semibold">{duration}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div className="relative w-full h-[400px]">
        <div ref={mapRef} className="absolute inset-0" suppressHydrationWarning />

        {!currentDriverLocation && ['OUT_FOR_DELIVERY', 'ARRIVED'].includes(delivery.status) && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Card className="pointer-events-auto mx-4 max-w-sm p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-3">
                <Truck className="size-5 animate-bounce text-muted-foreground" />
                <h3 className="font-semibold">Esperando ubicación del repartidor</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                El mapa se actualizará automáticamente cuando el repartidor esté en movimiento.
              </p>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t p-4">
        <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium">Dirección de entrega</p>
            <p className="text-sm text-muted-foreground">{delivery.destinationAddress}</p>
            {delivery.destinationReference && (
              <p className="mt-1 text-xs text-muted-foreground">
                Referencia: {delivery.destinationReference}
              </p>
            )}
          </div>
        </div>

        {delivery.driverName && (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Avatar className="size-10">
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{delivery.driverName}</p>
              {delivery.driverPhone && (
                <p className="text-xs text-muted-foreground">{delivery.driverPhone}</p>
              )}
              <Badge variant="secondary" className="mt-1">
                Tu repartidor
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
