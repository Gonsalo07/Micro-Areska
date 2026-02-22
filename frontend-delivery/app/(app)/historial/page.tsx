"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Input,
} from "@nextui-org/react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import type { OrderDeliveryDetailResponse, DeliveryStatus } from "@/lib/types/order";

const statusColorMap: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default function HistorialPage() {
  const { driver } = useAuthStore();
  const [deliveries, setDeliveries] = useState<OrderDeliveryDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!driver?.id) {
        setLoading(false);
        return;
      }

      try {
        const allDeliveries = await orderDeliveriesApi.getByDriverId(driver.id);
        // Filtrar solo las entregas completadas/entregadas o canceladas
        const completedDeliveries = allDeliveries.filter(
          (delivery) =>
            delivery.status === "DELIVERED" ||
            delivery.status === "CANCELLED"
        );
        // Ordenar por fecha más reciente
        completedDeliveries.sort(
          (a, b) =>
            new Date(b.deliveredAt || b.updatedAt).getTime() -
            new Date(a.deliveredAt || a.updatedAt).getTime()
        );
        setDeliveries(completedDeliveries);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [driver?.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.orderId.toString().includes(searchLower) ||
      delivery.id.toString().includes(searchLower) ||
      formatDate(delivery.deliveredAt || delivery.updatedAt).toLowerCase().includes(searchLower) ||
      (delivery.destinationAddress?.toLowerCase().includes(searchLower) || false)
    );
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Cargando historial..." />
      </div>
    );
  }

  const deliveredCount = deliveries.filter(d => d.status === "DELIVERED").length;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📋 Historial de Entregas</h1>
          <p className="text-default-500 text-sm">
            {deliveredCount} entregas completadas
          </p>
        </div>
        <Input
          placeholder="Buscar por # de orden..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
          size="sm"
          startContent={
            <span className="text-default-400">🔍</span>
          }
        />
      </div>

      {/* Tabla */}
      {deliveries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-default-600">
              Sin entregas completadas
            </h3>
            <p className="text-default-400 mt-2">
              Cuando completes entregas, aparecerán aquí
            </p>
          </div>
        </div>
      ) : (
        <Table
          aria-label="Historial de entregas"
          classNames={{
            wrapper: "flex-1",
          }}
        >
          <TableHeader>
            <TableColumn># Orden</TableColumn>
            <TableColumn>Fecha Asignación</TableColumn>
            <TableColumn>Fecha Entrega</TableColumn>
            <TableColumn>Destino</TableColumn>
            <TableColumn>Estado</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay entregas que mostrar">
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <span className="font-semibold">#{delivery.orderId}</span>
                </TableCell>
                <TableCell>{formatDate(delivery.assignedAt || delivery.createdAt)}</TableCell>
                <TableCell>
                  <span className={delivery.status === "DELIVERED" ? "text-success-600 font-medium" : "text-danger-600"}>
                    {formatDate(delivery.deliveredAt || delivery.cancelledAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-default-600 truncate max-w-[200px] block">
                    {delivery.destinationAddress || "Sin dirección"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[delivery.status] || "default"}
                    size="sm"
                    variant="flat"
                  >
                    {delivery.status === "DELIVERED" ? "Entregado ✓" : delivery.status === "CANCELLED" ? "Cancelado ✗" : delivery.status}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Resumen */}
      {deliveries.length > 0 && (
        <div className="flex gap-4 justify-end">
          <div className="bg-default-100 px-4 py-2 rounded-lg">
            <span className="text-default-500 text-sm">Total entregas: </span>
            <span className="font-bold">{deliveries.length}</span>
          </div>
          <div className="bg-success/10 px-4 py-2 rounded-lg">
            <span className="text-success-600 text-sm">Completadas: </span>
            <span className="font-bold text-success-600">{deliveredCount}</span>
          </div>
          {deliveries.length - deliveredCount > 0 && (
            <div className="bg-danger/10 px-4 py-2 rounded-lg">
              <span className="text-danger-600 text-sm">Canceladas: </span>
              <span className="font-bold text-danger-600">{deliveries.length - deliveredCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
