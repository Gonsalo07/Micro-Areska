'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { MapPin, Navigation, Truck } from 'lucide-react'

import type { OrderDeliveryDetail } from '@public/api/delivery'

import { type DeliveryLocationUpdate, useWebSocketTracking } from '@/hooks/use-websocket-tracking'

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

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

    if (!apiKey) {
      console.warn('Google Maps API key no configurada')
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
      <div className="w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay información de entrega disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      {/* Indicador de conexión WebSocket */}
      {isConnected && (
        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Tracking en tiempo real activo
            </span>
          </div>
        </div>
      )}

      {/* Información de distancia y tiempo */}
      {distance && duration && (
        <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                En camino
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Distancia</p>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {distance}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo aprox.</p>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div className="relative w-full h-[400px]">
        <div ref={mapRef} className="absolute inset-0" suppressHydrationWarning />

        {!currentDriverLocation && ['OUT_FOR_DELIVERY', 'ARRIVED'].includes(delivery.status) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl max-w-sm mx-4 pointer-events-auto">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Esperando ubicación del repartidor
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El mapa se actualizará automáticamente cuando el repartidor esté en movimiento.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Información de la entrega */}
      <div className="p-4 space-y-3 bg-white dark:bg-gray-900">
        <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Dirección de Entrega
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {delivery.destinationAddress}
            </p>
            {delivery.destinationReference && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Referencia: {delivery.destinationReference}
              </p>
            )}
          </div>
        </div>

        {delivery.driverName && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              {delivery.driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {delivery.driverName}
              </p>
              {delivery.driverPhone && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{delivery.driverPhone}</p>
              )}
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Tu repartidor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
