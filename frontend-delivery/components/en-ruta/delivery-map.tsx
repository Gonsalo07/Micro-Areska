"use client";

import { useEffect, useRef, useState } from "react";
import { Chip, Button, Switch } from "@nextui-org/react";
import type { OrderDeliveryDetailResponse, DeliveryStatus } from "@/lib/types/order";
import { useDeliveryLocationSender } from "@/hooks/use-delivery-location-sender";

declare global {
  interface Window {
    google: any;
  }
}

interface DeliveryMapProps {
  delivery?: OrderDeliveryDetailResponse;
}

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: "warning" | "primary" | "success" | "default" }> = {
  PENDING_ASSIGNMENT: { label: "Pendiente", color: "default" },
  ASSIGNED: { label: "Asignado", color: "default" },
  ACCEPTED: { label: "Aceptado", color: "primary" },
  PICKED_UP: { label: "Recogido", color: "primary" },
  OUT_FOR_DELIVERY: { label: "En camino", color: "warning" },
  ARRIVED: { label: "En destino", color: "success" },
  DELIVERED: { label: "Entregado", color: "success" },
  CANCELLED: { label: "Cancelado", color: "default" },
};

export const DeliveryMap = ({ delivery }: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const hasInitialFitRef = useRef<boolean>(false);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  
  // Guardar última ubicación pendiente para reenviar cuando conecte
  const pendingLocationRef = useRef<{lat: number, lng: number, distance: string, duration: string} | null>(null);

  // === TEST MODE ===
  const [testMode, setTestMode] = useState(true);
  const testModeRef = useRef(true);
  const startTrackingRef = useRef<(() => void) | null>(null);
  const simStepRef = useRef<number>(0);
  const [simStep, setSimStep] = useState(0);          // solo para display
  const triggerSimMoveRef = useRef<(() => void) | null>(null);
  const routePathRef = useRef<{lat: number; lng: number}[]>([]);  // puntos reales de la ruta

  // WebSocket para enviar ubicación en tiempo real
  const { 
    disconnect, 
    sendLocation, 
    isConnected 
  } = useDeliveryLocationSender({
    deliveryId: delivery?.id,
    orderId: delivery?.orderId,
    enabled: !!delivery && ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED'].includes(delivery.status),
  });

  console.log('🔍 Estado del delivery:', {
    deliveryId: delivery?.id,
    orderId: delivery?.orderId,
    status: delivery?.status,
    enabled: !!delivery && ['OUT_FOR_DELIVERY', 'ARRIVED'].includes(delivery.status),
    isConnected
  });

  const sendLocationRef = useRef(sendLocation);
  const disconnectRef = useRef(disconnect);
  const isConnectedRef = useRef(isConnected);

  // Actualizar refs cuando cambien las funciones o estado
  useEffect(() => {
    sendLocationRef.current = sendLocation;
    disconnectRef.current = disconnect;
    isConnectedRef.current = isConnected;
  }, [sendLocation, disconnect, isConnected]);

  // 🔄 Enviar ubicación pendiente cuando el WebSocket conecte
  useEffect(() => {
    if (isConnected && pendingLocationRef.current && sendLocationRef.current) {
      console.log('🔄 WebSocket conectado - enviando ubicación pendiente:', pendingLocationRef.current);
      const { lat, lng, distance: dist, duration: dur } = pendingLocationRef.current;
      const sent = sendLocationRef.current(lat, lng, dist, dur);
      if (sent) {
        console.log('✅ Ubicación pendiente enviada exitosamente');
        pendingLocationRef.current = null; // Limpiar después de enviar
      }
    }
  }, [isConnected]);

  useEffect(() => {
    // Prevenir múltiples inicializaciones del mapa
    if (!delivery || !mapRef.current || mapInitializedRef.current) {
      return;
    }

    console.log("🗺️ Inicializando mapa por primera vez");

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!apiKey) {
      console.warn("Google Maps API key no configurada");
      return;
    }

    // Cargar Google Maps script dinámicamente (solo si no existe)
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    
    if (!window.google && !existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.id = "google-maps-script";
      document.head.appendChild(script);
    } else if (window.google) {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;
      
      console.log("🗺️ Creando instancia de mapa");
      mapInitializedRef.current = true;
      
      // ========== DEBUG - Ver datos del delivery ==========
      console.log("📦 Delivery data:", delivery);
      console.log("📍 Coordenadas destino:", {
        lat: delivery?.destinationLat,
        lng: delivery?.destinationLng,
        address: delivery?.destinationAddress
      });
      // ========== FIN DEBUG ==========
      
      // Obtener coordenadas de destino
      const destinationLat = delivery?.destinationLat || 19.4326; // CDMX default
      const destinationLng = delivery?.destinationLng || -99.1332;
      console.log("🏠 Usando destino:", destinationLat, destinationLng);
      
      // Usar coordenadas de destino como centro
      const center = { lat: destinationLat, lng: destinationLng };
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Inicializar servicio de direcciones
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: true, // Usaremos nuestros propios marcadores
        preserveViewport: true, // NO mover el mapa al actualizar la ruta
        polylineOptions: {
          strokeColor: "#4F46E5", // Indigo
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });

      // Marcador del destino
      destinationMarkerRef.current = new window.google.maps.Marker({
        position: { lat: destinationLat, lng: destinationLng },
        map: mapInstanceRef.current,
        title: "Destino: " + (delivery?.destinationAddress || "Cliente"),
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
        animation: window.google.maps.Animation.DROP,
      });
      
      console.log("🎯 Marcador de destino creado en:", destinationLat, destinationLng);

      // Iniciar seguimiento de ubicación
      startLocationTracking();
    }

    // Función para actualizar la ubicación del repartidor y trazar la ruta
    function updateDriverLocation(position: GeolocationPosition) {
      if (!mapInstanceRef.current || !window.google) return;

      const driverLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Coordenadas de destino
      const destinationLat = delivery?.destinationLat || 19.4326;
      const destinationLng = delivery?.destinationLng || -99.1332;

      // Crear o actualizar marcador del repartidor
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setPosition(driverLocation);
      } else {
        driverMarkerRef.current = new window.google.maps.Marker({
          position: driverLocation,
          map: mapInstanceRef.current,
          title: "Tu ubicación",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          animation: window.google.maps.Animation.DROP,
        });
        console.log("📍 Marcador del repartidor creado en:", driverLocation);
      }

      // Ajustar vista del mapa para mostrar ambos puntos - SOLO LA PRIMERA VEZ
      if (destinationMarkerRef.current && driverMarkerRef.current && !hasInitialFitRef.current) {
        hasInitialFitRef.current = true;
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(driverLocation);
        bounds.extend({ lat: destinationLat, lng: destinationLng });
        mapInstanceRef.current.fitBounds(bounds);
        // Ajustar zoom para que no esté muy cerca
        window.google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
          const currentZoom = mapInstanceRef.current.getZoom();
          if (currentZoom > 15) {
            mapInstanceRef.current.setZoom(15);
          }
        });
      }

      // Trazar ruta si hay destino (usando Directions API ✅)
      if (destinationLat && destinationLng) {
        const destination = {
          lat: destinationLat,
          lng: destinationLng,
        };
        
        // Validación robusta del servicio de direcciones
        if (!directionsServiceRef.current || typeof directionsServiceRef.current.route !== 'function') {
          console.warn("⚠️ DirectionsService no está listo todavía, intentando de nuevo en 1 segundo...");
          setTimeout(() => updateDriverLocation(position), 1000);
          return;
        }
        
        console.log("🗺️ Trazando ruta desde:", driverLocation, "hasta:", destination);

        try {
          directionsServiceRef.current.route(
            {
              origin: driverLocation,
              destination: destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result: any, status: any) => {
              if (status === "OK" && result) {
                directionsRendererRef.current?.setDirections(result);
                
                // Actualizar distancia y duración
                const route = result.routes[0];
                if (route && route.legs[0]) {
                  const calculatedDistance = route.legs[0].distance.text;
                  const calculatedDuration = route.legs[0].duration.text;

                  // Guardar puntos reales de la ruta para simulación paso a paso
                  if (route.overview_path && routePathRef.current.length === 0) {
                    routePathRef.current = route.overview_path.map((p: any) => ({
                      lat: p.lat(),
                      lng: p.lng(),
                    }));
                    console.log(`🗺️ Ruta guardada: ${routePathRef.current.length} puntos`);
                  }

                  setDistance(calculatedDistance);
                  setDuration(calculatedDuration);
                  console.log("✅ Ruta calculada:", calculatedDistance, calculatedDuration);
                  
                  // 🚀 Enviar ubicación por WebSocket en tiempo real
                  console.log("🔍 Estado para enviar ubicación:", {
                    isConnected: isConnectedRef.current,
                    hasSendLocation: !!sendLocationRef.current,
                    deliveryId: delivery?.id,
                    orderId: delivery?.orderId
                  });
                  
                  if (isConnectedRef.current && sendLocationRef.current) {
                    const sent = sendLocationRef.current(
                      position.coords.latitude,
                      position.coords.longitude,
                      calculatedDistance,
                      calculatedDuration
                    );
                    if (sent) {
                      console.log("📡 Ubicación enviada por WebSocket a clientes");
                      pendingLocationRef.current = null; // Limpiar pendiente si envió OK
                    } else {
                      console.warn("⚠️ sendLocation retornó false");
                    }
                  } else {
                    // Guardar ubicación pendiente para enviar cuando conecte
                    console.log("⏳ WebSocket no conectado, guardando ubicación pendiente...");
                    pendingLocationRef.current = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      distance: calculatedDistance,
                      duration: calculatedDuration
                    };
                  }
                }
              } else {
                console.error("❌ Error al calcular ruta:", status);
                console.error("💡 Verifica que Directions API esté habilitada en Google Cloud Console");
              }
            }
          );
        } catch (error) {
          console.error("❌ Error al llamar DirectionsService:", error);
          // Reintentar en 2 segundos
          setTimeout(() => updateDriverLocation(position), 2000);
        }
      } else {
        console.warn("⚠️ No hay coordenadas de destino para trazar ruta");
      }
    }

    // Función para iniciar el seguimiento de ubicación
    function startLocationTracking() {
      // Limpiar tracking anterior si existía
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (testModeRef.current) {
        // ===== MODO TEST: posición inicial fija, el botón mueve manualmente =====
        const testLocation = {
          coords: { latitude: -12.050385, longitude: -77.000823, accuracy: 10,
            altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        } as GeolocationPosition;
        console.log("🧪 [TEST MODE] Posición inicial colocada. Usa el botón para mover.");
        updateDriverLocation(testLocation);
        // watchIdRef queda null — sin actualización automática
      } else {
        // ===== MODO REAL: GPS del dispositivo =====
        if (!navigator.geolocation) {
          console.error("Geolocalización no soportada");
          return;
        }
        console.log("📡 [GPS MODE] Iniciando seguimiento real de ubicación...");
        simStepRef.current = 0; // reset por si vuelve a test
        navigator.geolocation.getCurrentPosition(
          updateDriverLocation,
          (error) => console.error("Error obteniendo ubicación:", error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        watchIdRef.current = navigator.geolocation.watchPosition(
          updateDriverLocation,
          (error) => console.error("Error actualizando ubicación:", error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
      }
    }

    // Exponer startTracking para poder relanzarlo cuando cambie testMode
    startTrackingRef.current = startLocationTracking;

    // Exponer función de simulación manual al ref externo
    triggerSimMoveRef.current = () => {
      const path = routePathRef.current;

      // Si la ruta real ya está cargada, avanzar por sus puntos
      if (path.length > 1) {
        // Avanzar de 2 en 2 puntos para que se note el movimiento
        simStepRef.current = Math.min(simStepRef.current + 2, path.length - 1);
        setSimStep(simStepRef.current);
        const point = path[simStepRef.current];
        const totalPoints = path.length - 1;
        const pct = Math.round((simStepRef.current / totalPoints) * 100);
        const fakeDist = `${((1 - simStepRef.current / totalPoints) * 2.0).toFixed(1)} km`;
        console.log(`🚗 [TEST] Punto ${simStepRef.current}/${totalPoints} (${pct}%) → Lat: ${point.lat.toFixed(6)}, Lng: ${point.lng.toFixed(6)}`);
        const fakePosition = {
          coords: { latitude: point.lat, longitude: point.lng, accuracy: 10,
            altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        } as GeolocationPosition;
        updateDriverLocation(fakePosition);
        sendLocationRef.current?.(point.lat, point.lng, fakeDist, '---');
        return;
      }

      // Fallback: interpolación lineal mientras la ruta no esté lista
      simStepRef.current += 1;
      setSimStep(simStepRef.current);
      const START_LAT = -12.050385;
      const START_LNG = -77.000823;
      const destLat = delivery?.destinationLat ?? (START_LAT + 0.02);
      const destLng = delivery?.destinationLng ?? (START_LNG + 0.02);
      const TOTAL_SIM_STEPS = 20;
      const fraction = Math.min(simStepRef.current / TOTAL_SIM_STEPS, 1.0);
      const newLat = START_LAT + fraction * (destLat - START_LAT);
      const newLng = START_LNG + fraction * (destLng - START_LNG);
      console.log(`🚗 [TEST-fallback] Paso ${simStepRef.current} (ruta aún no cargada)`);
      const fakePosition = {
        coords: { latitude: newLat, longitude: newLng, accuracy: 10,
          altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now(),
      } as GeolocationPosition;
      updateDriverLocation(fakePosition);
      sendLocationRef.current?.(newLat, newLng, `${((1 - fraction) * 2.0).toFixed(1)} km`, '---');
    };

    initMap();

    return () => {
      console.log("🗺️ Limpiando mapa y recursos");
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      mapInitializedRef.current = false;
      mapInstanceRef.current = null;
      driverMarkerRef.current = null;
      destinationMarkerRef.current = null;
      directionsRendererRef.current = null;
      directionsServiceRef.current = null;
    };
  }, [delivery?.id]);

  // Cuando cambia el switch: relanzar tracking sin re-inicializar el mapa
  useEffect(() => {
    testModeRef.current = testMode;
    simStepRef.current = 0;
    setSimStep(0);
    routePathRef.current = [];  // forzar re-descarga de ruta al cambiar de modo
    // Limpiar GPS real si estaba activo
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    // Si el mapa ya está listo, relanzar tracking con el nuevo modo
    if (mapInitializedRef.current && startTrackingRef.current) {
      startTrackingRef.current();
    }
  }, [testMode]); // Solo depender del ID del delivery

  if (!delivery) {
    return (
      <div className="flex-1 flex items-center justify-center bg-default-100 rounded-lg border-2 border-dashed border-default-300">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-default-600">No hay entrega actual</h3>
          <p className="text-default-400 mt-2">
            Cuando tengas una entrega asignada, verás el mapa aquí
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[delivery.status] || { label: delivery.status, color: "default" as const };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-primary/10 p-3 rounded-t-lg border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary">Orden #{delivery.orderId}</h3>
            <p className="text-sm text-default-500 truncate max-w-[250px]">
              {delivery.destinationAddress || "Sin dirección especificada"}
            </p>
          </div>
          <div className="text-right">
            <Chip size="sm" color={statusConfig.color} variant="flat">
              {statusConfig.label}
            </Chip>
          </div>
        </div>
        
        {/* Indicador de WebSocket en tiempo real */}
        {isConnected && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success-600 font-medium">
              Tracking en tiempo real activo
            </span>
          </div>
        )}
        
        {/* Información de ruta */}
        {(distance || duration) && (
          <div className="mt-3 flex gap-4 text-sm">
            {distance && (
              <div className="flex items-center gap-1">
                <span className="text-default-400">📍</span>
                <span className="font-medium text-primary">{distance}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1">
                <span className="text-default-400">⏱️</span>
                <span className="font-medium text-primary">{duration}</span>
              </div>
            )}
          </div>
        )}
        
        {delivery.customerNotes && (
          <div className="mt-2 text-sm bg-warning/10 p-2 rounded">
            <span className="font-medium">📝 Nota del cliente:</span> {delivery.customerNotes}
          </div>
        )}

        {/* Switch TEST / GPS + botón de simulación */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <Switch
            size="sm"
            color="warning"
            isSelected={testMode}
            onValueChange={setTestMode}
          >
            <span className="text-xs font-mono">{testMode ? '🧪 Modo TEST' : '📡 GPS Real'}</span>
          </Switch>

          {testMode && (
            <Button
              size="sm"
              variant="flat"
              color="warning"
              className="text-xs font-mono flex-1"
              startContent="🚗"
              onPress={() => triggerSimMoveRef.current?.()}
            >
              Simular movimiento ({simStep}/{routePathRef.current.length > 1 ? routePathRef.current.length - 1 : 20})
            </Button>
          )}

          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            isConnected ? 'bg-success/10 text-success-600' : 'bg-default-100 text-default-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-default-300'}`} />
            {isConnected ? 'WS ON' : 'WS OFF'}
          </div>
        </div>
      </div>
      <div ref={mapRef} className="flex-1 min-h-0 rounded-b-lg" />
    </div>
  );
};
