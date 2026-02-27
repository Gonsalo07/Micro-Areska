"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { CheckCircle2, Clock, Package, TrendingUp, Truck, XCircle } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import type { OrderDeliveryDetailResponse } from "@/lib/types/order";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Helpers
function getLast7Days(): string[] {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getShortDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-PE", { weekday: "short" });
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

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export const Content = () => {
  const { driver, loading: authLoading } = useAuthStore();
  const [deliveries, setDeliveries] = useState<OrderDeliveryDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ─── Stats derivados ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const delivered   = deliveries.filter((d) => d.status === "DELIVERED");
    const cancelled   = deliveries.filter((d) => d.status === "CANCELLED");
    const active      = deliveries.filter((d) => !["DELIVERED", "CANCELLED"].includes(d.status));
    const total       = delivered.length + cancelled.length;
    const successRate = total > 0 ? Math.round((delivered.length / total) * 100) : 0;

    const last7 = getLast7Days();
    const thisWeek = delivered.filter((d) => {
      const date = (d.deliveredAt ?? d.updatedAt ?? "").split("T")[0];
      return last7.includes(date);
    }).length;

    // Datos para el gráfico: entregas por día en últimos 7 días
    const chartData = last7.map((day) =>
      delivered.filter((d) => (d.deliveredAt ?? d.updatedAt ?? "").startsWith(day)).length
    );
    const chartLabels = last7.map(getShortDayLabel);

    // Últimas 5 entregas (desc por fecha)
    const recent = [...deliveries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);

    return { delivered: delivered.length, cancelled: cancelled.length, active: active.length, thisWeek, successRate, chartData, chartLabels, recent };
  }, [deliveries]);

  // ─── Chart options ─────────────────────────────────────────────────────────
  const chartOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    colors: ["#006FEE"],
    dataLabels: { enabled: false },
    xaxis: { categories: stats.chartLabels, labels: { style: { colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: "#9ca3af" } }, tickAmount: 3 },
    grid: { borderColor: "#374151", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
    theme: { mode: "dark" },
  };

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

      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Bienvenido, <span className="text-primary">{driver.fullName?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
          Aquí está tu resumen de actividad como repartidor.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completadas */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="flex flex-col gap-3 p-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.delivered}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Entregas completadas</p>
            </div>
          </CardBody>
        </Card>

        {/* Esta semana */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="flex flex-col gap-3 p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.thisWeek}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Esta semana</p>
            </div>
          </CardBody>
        </Card>

        {/* Tasa de éxito */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="flex flex-col gap-3 p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.successRate}<span className="text-lg font-bold text-gray-400">%</span></p>
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Tasa de éxito</p>
            </div>
          </CardBody>
        </Card>

        {/* Canceladas */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-md rounded-2xl">
          <CardBody className="flex flex-col gap-3 p-5">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.cancelled}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Canceladas</p>
            </div>
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
            <ApexChart
              type="bar"
              series={[{ name: "Entregas", data: stats.chartData }]}
              options={chartOptions}
              height={220}
            />
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
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${driver.isAvailable ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-zinc-400"}`}>
                  {driver.isAvailable ? "DISPONIBLE" : "OCUPADO"}
                </span>
              </div>
            </div>

            <Button
              as={Link}
              href="/pedidos"
              color="primary"
              size="md"
              className="font-bold w-full mt-auto"
              startContent={<Package size={18} />}
            >
              Ver pedidos
            </Button>
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
              <Button as={Link} href="/pedidos" color="primary" size="sm" className="font-bold mt-2">
                Buscar pedidos disponibles
              </Button>
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
                      <Chip color={chipProps.color} variant="flat" size="sm" className="font-bold text-[10px] uppercase tracking-wide">
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
