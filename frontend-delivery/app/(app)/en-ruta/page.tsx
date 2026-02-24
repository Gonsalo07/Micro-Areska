"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { DeliveryMap } from "@/components/en-ruta/delivery-map";
import { DeliveryChat } from "@/components/en-ruta/delivery-chat";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import type { OrderDeliveryDetailResponse, DeliveryStatus } from "@/lib/types/order";

// Estados donde el chat debe estar habilitado
const CHAT_ENABLED_STATUSES: DeliveryStatus[] = ["OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];
// Estados donde se muestra el mapa
const MAP_VISIBLE_STATUSES: DeliveryStatus[] = ["ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];

export default function EnRutaPage() {
  const { driver } = useAuthStore();
  const [activeDelivery, setActiveDelivery] = useState<OrderDeliveryDetailResponse | null>(null);
  const [lastCompletedDelivery, setLastCompletedDelivery] = useState<{ orderId: number; status: "DELIVERED" | "CANCELLED" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const isChatEnabled = activeDelivery && CHAT_ENABLED_STATUSES.includes(activeDelivery.status);
  const isMapVisible = activeDelivery && MAP_VISIBLE_STATUSES.includes(activeDelivery.status);

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
      setLastCompletedDelivery({ orderId: activeDelivery.orderId, status: "DELIVERED" });
      setActiveDelivery(null);
    } catch (error) {
      console.error("Error marking delivered:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    const labels: Record<string, { label: string; color: "warning" | "primary" | "secondary" | "success" }> = {
      ACCEPTED: { label: "Aceptado", color: "primary" },
      PICKED_UP: { label: "Recogido del local", color: "primary" },
      OUT_FOR_DELIVERY: { label: "En camino", color: "secondary" },
      ARRIVED: { label: "Llegó al destino", color: "success" },
    };
    return labels[status] || { label: status, color: "warning" as const };
  };

  const getStatusStep = (status: string) => {
    const steps = ["ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY", "ARRIVED", "DELIVERED"];
    return steps.indexOf(status) + 1;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Buscando entrega activa..." />
      </div>
    );
  }

  // Estado: Entrega completada
  if (!activeDelivery && lastCompletedDelivery) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-5xl">
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-600">¡Entrega completada!</h2>
            <p className="text-default-500 mt-2">
              La orden #{lastCompletedDelivery.orderId} fue entregada exitosamente.
            </p>
          </div>
          <div className="flex gap-3">
            <Button color="default" variant="flat" as={Link} href="/historial">
              Ver historial
            </Button>
            <Button color="primary" as={Link} href="/pedidos">
              Ver pedidos disponibles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Sin entregas activas
  if (!activeDelivery) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-default-100 flex items-center justify-center text-5xl">
            🛣️
          </div>
          <div>
            <h2 className="text-2xl font-bold">Sin entregas activas</h2>
            <p className="text-default-500 mt-2">
              Acepta un pedido disponible para comenzar a entregar.
            </p>
          </div>
          <Button color="primary" as={Link} href="/pedidos">
            Ver pedidos disponibles
          </Button>
        </div>
      </div>
    );
  }

  const STEPS = [
    { key: "ACCEPTED", label: "Aceptado", icon: "✅" },
    { key: "PICKED_UP", label: "Recogido", icon: "📦" },
    { key: "OUT_FOR_DELIVERY", label: "En camino", icon: "🚗" },
    { key: "ARRIVED", label: "Llegó", icon: "📍" },
    { key: "DELIVERED", label: "Entregado", icon: "🎉" },
  ];

  const currentStep = getStatusStep(activeDelivery.status);

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">🛣️ En Ruta</h1>
          <p className="text-default-500 text-sm">Orden #{activeDelivery.orderId} en curso</p>
        </div>
        <div className="flex items-center gap-2">
          <Chip color={getStatusLabel(activeDelivery.status).color} variant="flat" size="sm">
            {getStatusLabel(activeDelivery.status).label}
          </Chip>

          {activeDelivery.status === "ACCEPTED" && (
            <Button color="secondary" size="sm" startContent="📦" onClick={handlePickedUp} isLoading={updating} className="font-semibold">
              Pedido recogido
            </Button>
          )}
          {activeDelivery.status === "PICKED_UP" && (
            <Button color="primary" size="sm" startContent="🚗" onClick={handleStartDelivery} isLoading={updating} className="font-semibold">
              Iniciar viaje
            </Button>
          )}
          {activeDelivery.status === "OUT_FOR_DELIVERY" && (
            <Button color="warning" size="sm" startContent="📍" onClick={handleMarkArrived} isLoading={updating} className="font-semibold">
              He llegado al destino
            </Button>
          )}
          {activeDelivery.status === "ARRIVED" && (
            <Button color="success" size="sm" startContent="✅" onClick={handleMarkDelivered} isLoading={updating} className="font-semibold">
              Marcar entregado
            </Button>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 min-w-[60px] ${isCurrent || isDone ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isCurrent ? "bg-primary text-white" : isDone ? "bg-success text-white" : "bg-default-200 text-default-500"}`}>
                  {isDone ? "✓" : step.icon}
                </div>
                <span className={`text-[10px] text-center leading-tight
                  ${isCurrent ? "text-primary font-semibold" : isDone ? "text-success" : "text-default-400"}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-4 mx-1 mb-4 rounded ${stepNum < currentStep ? "bg-success" : "bg-default-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mapa y Chat — solo visibles en los estados correctos */}
      <div className="flex gap-4 overflow-hidden" style={{ height: 'calc(100vh - 210px)' }}>
        {isMapVisible ? (
          <>
            <DeliveryMap delivery={activeDelivery} />
            {isChatEnabled && (
              <DeliveryChat isChatEnabled={true} delivery={activeDelivery} />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-default-200 text-default-400">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-medium">Dirígete al local a recoger el pedido</p>
            <p className="text-xs text-default-300">El mapa y el chat se activarán cuando inicies el viaje</p>
          </div>
        )}
      </div>

    </div>
  );
}
