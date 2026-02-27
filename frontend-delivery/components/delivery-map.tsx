/// <reference types="@types/google.maps" />
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeliveryMapProps {
  origin: string;
  destination: string;
  currentLocation?: { lat: number; lng: number } | null;
  status: string;
}

export default function DeliveryMap({
  origin,
  destination,
  currentLocation,
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef =
    useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef =
    useRef<google.maps.DirectionsService | null>(null);
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Wait for Google Maps to be available
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined" && window.google?.maps) {
        setIsLoaded(true);
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }, []);

  // Initialize Map Instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 13.6929, lng: -89.2182 },
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      directionsServiceRef.current =
        new window.google.maps.DirectionsService();
      directionsRendererRef.current =
        new window.google.maps.DirectionsRenderer({
          map: mapInstanceRef.current,
          polylineOptions: {
            strokeColor: "#2563EB",
            strokeWeight: 5,
          },
        });
    } catch (e) {
      console.error("Error initializing map:", e);
    }
  }, [isLoaded]);

  // Calculate Route
  useEffect(() => {
    if (
      !directionsServiceRef.current ||
      !directionsRendererRef.current ||
      !origin ||
      !destination ||
      !isLoaded
    )
      return;

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);
        } else {
          console.error(`Directions request failed: ${status}`);
          toast.error("No se pudo trazar la ruta en el mapa.");
        }
      }
    );
  }, [origin, destination, isLoaded]);

  // Update driver marker
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return;

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new window.google.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#000",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFF",
        },
        title: "Tu ubicación",
      });
    } else {
      driverMarkerRef.current.setPosition(currentLocation);
    }
  }, [currentLocation]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
