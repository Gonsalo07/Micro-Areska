"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Switch, Chip, Spinner } from "@nextui-org/react";
import { DeliveryMap } from "@/components/en-ruta/delivery-map";
import { DeliveryChat } from "@/components/en-ruta/delivery-chat";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import type { OrderDeliveryDetailResponse, DeliveryStatus } from "@/lib/types/order";

// Estados donde la entrega está "activa" (no finalizada)
const ACTIVE_STATUSES: DeliveryStatus[] = ["ASSIGNED", "ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];
// Estados donde el chat debe estar habilitado
const CHAT_ENABLED_STATUSES: DeliveryStatus[] = ["OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];

export default function EnRutaPage() {
  const { driver } = useAuthStore();
  const [activeDelivery, setActiveDelivery] = useState<OrderDeliveryDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Test mode
  const [testMode, setTestMode] = useState(false);

  const hasActiveDelivery = testMode || !!activeDelivery;
  const isChatEnabled = testMode || (activeDelivery && CHAT_ENABLED_STATUSES.includes(activeDelivery.status));

  const fetchActiveDelivery = useCallback(async () => {
    if (!driver?.id) {
      setLoading(false);
      return;
    }

    try {
      const deliveries = await orderDeliveriesApi.getActiveByDriverId(driver.id);
      // Tomar la primera entrega activa
      setActiveDelivery(deliveries.length > 0 ? deliveries[0] : null);
    } catch (error) {
      console.error("Error fetching active delivery:", error);
    } finally {
      setLoading(false);
    }
  }, [driver?.id]);

  useEffect(() => {
    fetchActiveDelivery();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchActiveDelivery, 30000);
    return () => clearInterval(interval);
  }, [fetchActiveDelivery]);

  const handleAcceptDelivery = async () => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      await orderDeliveriesApi.acceptDelivery(activeDelivery.id);
      await fetchActiveDelivery();
    } catch (error) {
      console.error("Error accepting delivery:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePickedUp = async () => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      await orderDeliveriesApi.markPickedUp(activeDelivery.id);
      await fetchActiveDelivery();
    } catch (error) {
      console.error("Error marking picked up:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStartDelivery = async () => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      await orderDeliveriesApi.markOutForDelivery(activeDelivery.id);
      await fetchActiveDelivery();
    } catch (error) {
      console.error("Error starting delivery:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkArrived = async () => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      await orderDeliveriesApi.markArrived(activeDelivery.id);
      await fetchActiveDelivery();
    } catch (error) {
      console.error("Error marking arrived:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      await orderDeliveriesApi.markDelivered(activeDelivery.id);
      setActiveDelivery(null); // Limpiar entrega - chat y mapa se desactivan
    } catch (error) {
      console.error("Error marking delivered:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    const labels: Record<string, { label: string; color: "warning" | "primary" | "secondary" | "success" }> = {
      ASSIGNED: { label: "Asignado", color: "warning" },
      ACCEPTED: { label: "Aceptado", color: "primary" },
      PICKED_UP: { label: "Recogido", color: "primary" },
      OUT_FOR_DELIVERY: { label: "En camino", color: "secondary" },
      ARRIVED: { label: "Llegó al destino", color: "success" },
    };
    return labels[status] || { label: status, color: "warning" as const };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Buscando entrega activa..." />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🛣️ En Ruta</h1>
          <p className="text-default-500 text-sm">
            {hasActiveDelivery
              ? `Orden #${activeDelivery?.orderId || "TEST"} en curso`
              : "Sin entregas activas"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Estado actual de la entrega */}
          {activeDelivery && (
            <Chip
              color={getStatusLabel(activeDelivery.status).color}
              variant="flat"
              size="lg"
            >
              {getStatusLabel(activeDelivery.status).label}
            </Chip>
          )}
          
          {/* Botón de Test - QUITAR DESPUÉS */}
          <div className="flex items-center gap-3 bg-warning/10 p-3 rounded-lg border border-warning/30">
            <span className="text-sm text-warning-600 font-medium">
              🧪 Test:
            </span>
            <Switch
              isSelected={testMode}
              onValueChange={setTestMode}
              color="warning"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Mapa */}
        <DeliveryMap delivery={testMode && !activeDelivery ? { id: 99999, orderId: 99999, status: "OUT_FOR_DELIVERY" as DeliveryStatus } as unknown as OrderDeliveryDetailResponse : activeDelivery ?? undefined} />
        
        {/* Chat - solo habilitado en OUT_FOR_DELIVERY o ARRIVED */}
        <DeliveryChat 
          isChatEnabled={!!isChatEnabled}
          delivery={activeDelivery || (testMode ? { id: 99999, orderId: 99999, status: "OUT_FOR_DELIVERY" as DeliveryStatus } as unknown as OrderDeliveryDetailResponse : undefined)}
        />
      </div>

      {/* Acciones según el estado */}
      {hasActiveDelivery && !testMode && activeDelivery && (
        <div className="flex gap-3 justify-center">
          {activeDelivery.status === "ASSIGNED" && (
            <Button 
              color="primary" 
              startContent="✅"
              onClick={handleAcceptDelivery}
              isLoading={updating}
            >
              Aceptar entrega
            </Button>
          )}
          
          {activeDelivery.status === "ACCEPTED" && (
            <Button 
              color="secondary" 
              startContent="📦"
              onClick={handlePickedUp}
              isLoading={updating}
            >
              Pedido recogido
            </Button>
          )}

          {activeDelivery.status === "PICKED_UP" && (
            <Button 
              color="secondary" 
              startContent="🚗"
              onClick={handleStartDelivery}
              isLoading={updating}
            >
              Iniciar viaje (En camino)
            </Button>
          )}

          {activeDelivery.status === "OUT_FOR_DELIVERY" && (
            <>
              <Button color="primary" variant="flat" startContent="📞">
                Llamar cliente
              </Button>
              <Button 
                color="warning" 
                startContent="📍"
                onClick={handleMarkArrived}
                isLoading={updating}
              >
                He llegado al destino
              </Button>
            </>
          )}

          {activeDelivery.status === "ARRIVED" && (
            <>
              <Button color="primary" variant="flat" startContent="📞">
                Llamar cliente
              </Button>
              <Button 
                color="success" 
                startContent="✅"
                onClick={handleMarkDelivered}
                isLoading={updating}
              >
                Marcar como entregado
              </Button>
            </>
          )}
        </div>
      )}

      {/* Acciones de test */}
      {testMode && (
        <div className="flex gap-3 justify-center">
          <Button color="success" variant="flat" startContent="📞">
            Llamar cliente
          </Button>
          <Button color="primary" variant="flat" startContent="📍">
            Abrir en Maps
          </Button>
          <Button color="warning" variant="flat" startContent="⚠️">
            Reportar problema
          </Button>
          <Button color="success" startContent="✅">
            Marcar entregado
          </Button>
        </div>
      )}
    </div>
  );
}
