"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { Car, Check, MapPin, Package, PartyPopper, ThumbsUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DeliveryMap } from "@/components/en-ruta/delivery-map";
import { DeliveryChat } from "@/components/en-ruta/delivery-chat";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import { ButtonStartIcon } from "@/components/button-start-icon";
import { PrimaryButton } from "@/components/primary-button";
import type { OrderDeliveryDetailResponse, DeliveryStatus } from "@/lib/types/order";

// Estados donde el chat debe estar habilitado
const CHAT_ENABLED_STATUSES: DeliveryStatus[] = ["OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];
// Estados donde se muestra el mapa
const MAP_VISIBLE_STATUSES: DeliveryStatus[] = ["ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY", "ARRIVED"] as DeliveryStatus[];

const actionBtnClass = "h-10 min-h-10 shrink-0 px-4 font-semibold";

export default function EnRutaPage() {
  // loading = true mientras Firebase Auth no ha resuelto (onAuthStateChanged pendiente)
  const { driver, loading: authLoading } = useAuthStore();
  const [activeDelivery, setActiveDelivery] = useState<OrderDeliveryDetailResponse | null>(null);
  const [lastCompletedDelivery, setLastCompletedDelivery] = useState<{ orderId: number; status: "DELIVERED" | "CANCELLED" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const isChatEnabled = activeDelivery && CHAT_ENABLED_STATUSES.includes(activeDelivery.status);
  const isMapVisible = activeDelivery && MAP_VISIBLE_STATUSES.includes(activeDelivery.status);

  const fetchActiveDelivery = useCallback(async () => {
    // Esperar a que Firebase Auth resuelva el estado del usuario antes de llamar la API
    if (!driver?.id) {
      return;
    }

    try {
      const deliveries = await orderDeliveriesApi.getActiveByDriverId(driver.id);
      // Tomar la primera entrega activa (ACCEPTED, PICKED_UP, OUT_FOR_DELIVERY, ARRIVED)
      setActiveDelivery(deliveries.length > 0 ? deliveries[0] : null);
    } catch (error) {
      console.error("Error fetching active delivery:", error);
    } finally {
      setLoading(false);
    }
  }, [driver?.id]);

  // Solo ejecutar cuando auth haya cargado (authLoading = false)
  useEffect(() => {
    if (authLoading) return; // Esperar a que Firebase Auth resuelva

    if (!driver?.id) {
      // Auth resolvió pero no hay driver (no autenticado)
      setLoading(false);
      return;
    }

    fetchActiveDelivery();
    // Refrescar cada 15 segundos
    const interval = setInterval(fetchActiveDelivery, 15000);
    return () => clearInterval(interval);
  }, [fetchActiveDelivery, authLoading, driver?.id]);

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

  const getStatusStep = (status: string) => {
    const steps = ["ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY", "ARRIVED", "DELIVERED"];
    return steps.indexOf(status) + 1;
  };

  if (loading || authLoading) {
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
            <PrimaryButton as={Link} href="/pedidos">
              Ver pedidos disponibles
            </PrimaryButton>
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
          <PrimaryButton as={Link} href="/pedidos">
            Ver pedidos disponibles
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const STEPS: { key: string; label: string; Icon: LucideIcon }[] = [
    { key: "ACCEPTED", label: "Aceptado", Icon: ThumbsUp },
    { key: "PICKED_UP", label: "Recogido", Icon: Package },
    { key: "OUT_FOR_DELIVERY", label: "En camino", Icon: Car },
    { key: "ARRIVED", label: "Llegó", Icon: MapPin },
    { key: "DELIVERED", label: "Entregado", Icon: PartyPopper },
  ];

  const currentStep = getStatusStep(activeDelivery.status);

  const progressSteps = (
    <>
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 min-w-[60px] ${isCurrent || isDone ? "opacity-100" : "opacity-30"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${isCurrent ? "bg-primary text-white" : isDone ? "bg-success text-white" : "bg-default-200 text-default-500"}`}
              >
                {isDone ? (
                  <Check size={15} strokeWidth={2.5} />
                ) : (
                  <step.Icon size={15} strokeWidth={1.75} />
                )}
              </div>
              <span
                className={`text-[10px] text-center leading-tight
                  ${isCurrent ? "text-primary font-semibold" : isDone ? "text-success" : "text-default-400"}`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-4 mx-1 mb-4 rounded ${stepNum < currentStep ? "bg-success" : "bg-default-200"}`} />
            )}
          </div>
        );
      })}
    </>
  );

  const actionButton = (
    <>
      {activeDelivery.status === "ACCEPTED" && (
        <Button color="secondary" size="md" startContent={<ButtonStartIcon icon={Package} size={15} />} onPress={handlePickedUp} isLoading={updating} className={actionBtnClass}>
          Pedido recogido
        </Button>
      )}
      {activeDelivery.status === "PICKED_UP" && (
        <PrimaryButton startContent={<ButtonStartIcon icon={Car} size={15} />} onPress={handleStartDelivery} isLoading={updating} className="shrink-0 px-4">
          Iniciar viaje
        </PrimaryButton>
      )}
      {activeDelivery.status === "OUT_FOR_DELIVERY" && (
        <PrimaryButton startContent={<ButtonStartIcon icon={MapPin} size={15} />} onPress={handleMarkArrived} isLoading={updating} className="shrink-0 px-4">
          He llegado al destino
        </PrimaryButton>
      )}
      {activeDelivery.status === "ARRIVED" && (
        <Button color="success" size="md" startContent={<ButtonStartIcon icon={Check} size={15} />} onPress={handleMarkDelivered} isLoading={updating} className={actionBtnClass}>
          Marcar entregado
        </Button>
      )}
    </>
  );

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      {/* Header + timeline */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 xl:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0 flex-1">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold">En Ruta</h1>
              <p className="text-default-500 text-sm">Orden #{activeDelivery.orderId} en curso</p>
            </div>
            <div className="hidden xl:flex items-center gap-1 overflow-x-auto flex-1 justify-start min-w-0">
              {progressSteps}
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-2 shrink-0 self-center">
            {actionButton}
          </div>
        </div>

        {/* Timeline móvil / tablet + acción a la derecha */}
        <div className="xl:hidden flex items-center gap-3 pb-1">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {progressSteps}
          </div>
          <div className="shrink-0">{actionButton}</div>
        </div>
      </div>

      {/* Mapa y Chat — solo visibles en los estados correctos */}
      <div className="flex gap-4 overflow-hidden flex-1 min-h-0 xl:[height:calc(100vh-160px)] [height:calc(100vh-210px)]">
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
