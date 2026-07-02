"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { CheckCircle2, Clock, Package, TrendingUp, Truck, XCircle } from "lucide-react";
import { format, subDays } from "date-fns";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import { ButtonStartIcon } from "@/components/button-start-icon";
import { PrimaryButton } from "@/components/primary-button";
import type { OrderDeliveryDetailResponse } from "@/lib/types/order";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function toLocalDateKey(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.includes("T") ? value : `${value}T12:00:00`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return value.split("T")[0] ?? null;
  }
  return format(parsed, "yyyy-MM-dd");
}

function getLast7Days(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) =>
    format(subDays(today, 6 - index), "yyyy-MM-dd")
  );
}

function getShortDayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("es-PE", { weekday: "short" });
}

function getDeliveryDateKey(delivery: OrderDeliveryDetailResponse): string | null {
  return toLocalDateKey(delivery.deliveredAt ?? delivery.updatedAt);
}

function getStatusChipProps(status: string): { color: "success" | "danger" | "warning" | "primary" | "default"; label: string } {
  const map: Record<string, { color: "success" | "danger" | "warning" | "primary" | "default"; label: string }> = {
    DELIVERED:        { color: "success",  label: "Entregado" },
    CANCELLED:        { color: "danger",   label: "Cancelado" },
    OUT_FOR_DELIVERY: { color: "warning",  label: "En camino" },
    ARRIVED:          { color: "warning",  label: "En destino" },
    PICKED_UP:        { color: "primary",  label: "Recogido" },
    ACCEPTED:         { color: "primary",  label: "Aceptado" },
    PENDING_ASSIGNMENT: { color: "default", label: "Pendiente" },
    ASSIGNED:         { color: "default",  label: "Asignado" },
  };
  return map[status] ?? { color: "default", label: status };
}

const flatChipLightBg: Record<string, string> = {
  success: "!bg-success/10",
  warning: "!bg-warning/10",
  danger: "!bg-danger/10",
  primary: "!bg-primary/10",
  default: "!bg-default/10",
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export const Content = () => {
  const { driver, loading: authLoading } = useAuthStore();
  const { resolvedTheme } = useTheme();
  const [deliveries, setDeliveries] = useState<OrderDeliveryDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMounted, setChartMounted] = useState(false);

  const fetchDeliveries = useCallback(async () => {
    if (!driver?.id) {
      setLoading(false);
      return;
    }
    try {
      const data = await orderDeliveriesApi.getByDriverId(driver.id);
      setDeliveries(data);
    } catch {
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, [driver?.id]);

  useEffect(() => {
    if (authLoading) return;
    fetchDeliveries();
  }, [authLoading, fetchDeliveries]);

  useEffect(() => {
    setChartMounted(true);
  }, []);

  // ─── Stats derivados ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const delivered   = deliveries.filter((d) => d.status === "DELIVERED");
    const cancelled   = deliveries.filter((d) => d.status === "CANCELLED");
    const active      = deliveries.filter((d) => !["DELIVERED", "CANCELLED"].includes(d.status));
    const total       = delivered.length + cancelled.length;
    const successRate = total > 0 ? Math.round((delivered.length / total) * 100) : 0;

    const last7 = getLast7Days();
    const thisWeek = delivered.filter((d) => {
      const date = getDeliveryDateKey(d);
      return date != null && last7.includes(date);
    }).length;

    const chartData = last7.map(
      (day) => delivered.filter((d) => getDeliveryDateKey(d) === day).length
    );
    const chartLabels = last7.map(getShortDayLabel);

    // Últimas 5 entregas (desc por fecha)
    const recent = [...deliveries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);

    return { delivered: delivered.length, cancelled: cancelled.length, active: active.length, thisWeek, successRate, chartData, chartLabels, recent };
  }, [deliveries]);

  // ─── Chart options ─────────────────────────────────────────────────────────
  const isDark = resolvedTheme === "dark";
  const chartOptions: ApexOptions = useMemo(() => {
    const labelColor = isDark ? "#a1a1aa" : "#6b7280";
    const gridColor = isDark ? "#3f3f46" : "#e5e7eb";

    return {
      chart: { type: "bar", toolbar: { show: false }, background: "transparent", fontFamily: "inherit" },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
      colors: ["#006FEE"],
      dataLabels: { enabled: false },
      xaxis: {
        categories: stats.chartLabels,
        labels: { style: { colors: labelColor } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: labelColor } },
        tickAmount: 3,
        min: 0,
        forceNiceScale: true,
      },
      grid: { borderColor: gridColor, strokeDashArray: 4 },
      tooltip: { theme: isDark ? "dark" : "light" },
    };
  }, [isDark, stats.chartLabels]);

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Cargando estadísticas..." color="primary" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <p className="text-gray-500 dark:text-zinc-400">No se encontró tu perfil de conductor.</p>
      </div>
    );
  }

  return (
    <div className="h-full px-4 lg:px-8 py-6 max-w-[90rem] mx-auto w-full flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Panel de repartidor
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
          Resumen de tu actividad y entregas recientes.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completadas */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="relative flex min-h-[128px] flex-col justify-center overflow-hidden !px-6 !py-4">
            <div className="relative z-10 flex flex-col gap-3.5">
              <p className="text-4xl font-extrabold leading-none text-gray-900 dark:text-white">{stats.delivered}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-400">Entregas completadas</p>
            </div>
            <CheckCircle2
              size={100}
              strokeWidth={1.25}
              className="pointer-events-none absolute -right-1 -top-1 text-green-600/15 dark:text-green-400/10"
            />
          </CardBody>
        </Card>

        {/* Esta semana */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="relative flex min-h-[128px] flex-col justify-center overflow-hidden !px-6 !py-4">
            <div className="relative z-10 flex flex-col gap-3.5">
              <p className="text-4xl font-extrabold leading-none text-gray-900 dark:text-white">{stats.thisWeek}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-400">Esta semana</p>
            </div>
            <TrendingUp
              size={100}
              strokeWidth={1.25}
              className="pointer-events-none absolute -right-1 -top-1 text-blue-600/15 dark:text-blue-400/10"
            />
          </CardBody>
        </Card>

        {/* Tasa de éxito */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="relative flex min-h-[128px] flex-col justify-center overflow-hidden !px-6 !py-4">
            <div className="relative z-10 flex flex-col gap-3.5">
              <p className="text-4xl font-extrabold leading-none text-gray-900 dark:text-white">{stats.successRate}<span className="ml-1.5 text-xl font-bold text-gray-400">%</span></p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-400">Tasa de éxito</p>
            </div>
            <TrendingUp
              size={100}
              strokeWidth={1.25}
              className="pointer-events-none absolute -right-1 -top-1 text-amber-600/15 dark:text-amber-400/10"
            />
          </CardBody>
        </Card>

        {/* Canceladas */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="relative flex min-h-[128px] flex-col justify-center overflow-hidden !px-6 !py-4">
            <div className="relative z-10 flex flex-col gap-3.5">
              <p className="text-4xl font-extrabold leading-none text-gray-900 dark:text-white">{stats.cancelled}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-400">Canceladas</p>
            </div>
            <XCircle
              size={100}
              strokeWidth={1.25}
              className="pointer-events-none absolute -right-1 -top-1 text-red-600/15 dark:text-red-400/10"
            />
          </CardBody>
        </Card>
      </div>

      {/* Chart + Recent */}
      <div className="flex flex-col xl:flex-row gap-4">

        {/* Gráfico semanal */}
        <Card className="flex-1 border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Entregas — últimos 7 días</h3>
              <Chip color="primary" variant="flat" size="sm" className="font-bold">
                {stats.thisWeek} esta semana
              </Chip>
            </div>
            {!chartMounted ? (
              <div className="flex h-[220px] items-center justify-center text-sm text-default-400">
                Cargando gráfico...
              </div>
            ) : stats.thisWeek === 0 ? (
              <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center text-default-400">
                <TrendingUp size={32} className="opacity-40" />
                <p className="text-sm font-medium">Sin entregas en los últimos 7 días</p>
                <p className="text-xs text-default-300">
                  Tienes {stats.delivered} entrega(s) completada(s) en tu historial.
                </p>
              </div>
            ) : (
              <ApexChart
                type="bar"
                series={[{ name: "Entregas", data: stats.chartData }]}
                options={chartOptions}
                height={220}
                width="100%"
              />
            )}
          </CardBody>
        </Card>

        {/* Estado actual */}
        <Card className="xl:w-72 border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="p-5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Estado actual</h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-primary" />
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">En curso</span>
                </div>
                <span className="text-lg font-extrabold text-primary">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-warning" />
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Total historial</span>
                </div>
                <span className="text-lg font-extrabold text-gray-900 dark:text-white">{deliveries.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${driver.isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Disponibilidad</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${driver.isAvailable ? "bg-green-500/10 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-gray-500/10 text-gray-500 dark:bg-zinc-500/10 dark:text-zinc-400"}`}>
                  {driver.isAvailable ? "Disponible" : "Ocupado"}
                </span>
              </div>
            </div>

            <PrimaryButton
              as={Link}
              href="/pedidos"
              fullWidth
              className="mt-auto"
              startContent={<ButtonStartIcon icon={Package} size={18} />}
            >
              Ver pedidos
            </PrimaryButton>
          </CardBody>
        </Card>
      </div>

      {/* Últimas entregas */}
      <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Últimas entregas</h3>
            <Button as={Link} href="/historial" size="sm" variant="light" color="primary" className="font-semibold text-xs">
              Ver historial completo →
            </Button>
          </div>

          {stats.recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400 dark:text-zinc-500">
              <Clock size={40} />
              <p className="text-sm font-medium">Aún no tienes entregas registradas</p>
              <PrimaryButton as={Link} href="/pedidos" className="mt-2 px-10">
                Buscar pedidos disponibles
              </PrimaryButton>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
              {stats.recent.map((d) => {
                const chipProps = getStatusChipProps(d.status);
                return (
                  <div key={d.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-gray-500 dark:text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          Orden <span className="font-mono text-primary">#{d.orderId}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                          {d.destinationAddress ?? "Dirección no disponible"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Chip
                        color={chipProps.color}
                        variant="flat"
                        size="sm"
                        className="font-bold text-[10px] tracking-wide"
                        classNames={{ base: flatChipLightBg[chipProps.color] }}
                      >
                        {chipProps.label}
                      </Chip>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                        {formatDate(d.deliveredAt ?? d.updatedAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

    </div>
  );
};
