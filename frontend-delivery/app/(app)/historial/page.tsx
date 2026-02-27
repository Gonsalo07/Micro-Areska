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
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Divider,
  Avatar,
} from "@nextui-org/react";
import { Eye } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import { ordersApi } from "@/features/delivery/api/orders";
import type { OrderDeliveryDetailResponse, OrderResponse } from "@/lib/types/order";

const statusColorMap: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default function HistorialPage() {
  const { driver } = useAuthStore();
  const [deliveries, setDeliveries] = useState<OrderDeliveryDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal de detalle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<OrderDeliveryDetailResponse | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!driver?.id) {
        setLoading(false);
        return;
      }

      try {
        const allDeliveries = await orderDeliveriesApi.getByDriverId(driver.id);
        const completedDeliveries = allDeliveries.filter(
          (delivery) =>
            delivery.status === "DELIVERED" ||
            delivery.status === "CANCELLED"
        );
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

  const handleViewDetail = async (delivery: OrderDeliveryDetailResponse) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
    setOrderDetail(null);
    setLoadingDetail(true);
    try {
      const order = await ordersApi.getById(delivery.orderId);
      setOrderDetail(order);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

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
      (delivery.customerName?.toLowerCase().includes(searchLower) || false) ||
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

  const deliveredCount = deliveries.filter((d) => d.status === "DELIVERED").length;

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
          placeholder="Buscar por # de orden o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72"
          size="sm"
          startContent={<span className="text-default-400">🔍</span>}
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
          classNames={{ wrapper: "flex-1" }}
        >
          <TableHeader>
            <TableColumn># Orden</TableColumn>
            <TableColumn>Cliente</TableColumn>
            <TableColumn>Fecha Entrega</TableColumn>
            <TableColumn>Destino</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay entregas que mostrar">
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <span className="font-semibold">#{delivery.orderId}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">
                      {delivery.customerName || "—"}
                    </p>
                    {delivery.customerPhone && (
                      <p className="text-xs text-default-400">
                        {delivery.customerPhone}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      delivery.status === "DELIVERED"
                        ? "text-success-600 font-medium"
                        : "text-danger-600"
                    }
                  >
                    {formatDate(delivery.deliveredAt || delivery.cancelledAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-default-600 truncate max-w-[180px] block">
                    {delivery.destinationAddress || "Sin dirección"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[delivery.status] || "default"}
                    size="sm"
                    variant="flat"
                  >
                    {delivery.status === "DELIVERED"
                      ? "Entregado ✓"
                      : delivery.status === "CANCELLED"
                      ? "Cancelado ✗"
                      : delivery.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Eye size={14} />}
                    onPress={() => handleViewDetail(delivery)}
                  >
                    Ver detalle
                  </Button>
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
              <span className="font-bold text-danger-600">
                {deliveries.length - deliveredCount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Modal de Detalle ── */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">
                    Detalle — Orden #{selectedDelivery?.orderId}
                  </span>
                  {selectedDelivery && (
                    <Chip
                      color={statusColorMap[selectedDelivery.status] || "default"}
                      size="sm"
                      variant="flat"
                    >
                      {selectedDelivery.status === "DELIVERED"
                        ? "Entregado ✓"
                        : "Cancelado ✗"}
                    </Chip>
                  )}
                </div>
              </ModalHeader>

              <ModalBody className="pb-6">
                {selectedDelivery && (
                  <div className="flex flex-col gap-5">
                    {/* ── Información del cliente ── */}
                    <div className="bg-default-50 rounded-xl p-4">
                      <h3 className="font-semibold text-xs text-default-400 uppercase tracking-wider mb-3">
                        👤 Información del cliente
                      </h3>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={selectedDelivery.customerName || "?"}
                          size="md"
                          color="primary"
                          isBordered
                        />
                        <div>
                          <p className="font-semibold text-base leading-tight">
                            {selectedDelivery.customerName || "Sin nombre"}
                          </p>
                          <p className="text-sm text-default-500">
                            📞&nbsp;
                            {selectedDelivery.customerPhone || "Sin teléfono"}
                          </p>
                        </div>
                      </div>
                      {selectedDelivery.destinationAddress && (
                        <div className="mt-3 flex items-start gap-2 text-sm">
                          <span className="text-default-400 mt-0.5">📍</span>
                          <p className="text-default-700">
                            {selectedDelivery.destinationAddress}
                          </p>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ── Productos del pedido ── */}
                    <div>
                      <h3 className="font-semibold text-xs text-default-400 uppercase tracking-wider mb-3">
                        🛍️ Productos del pedido
                      </h3>

                      {loadingDetail ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner size="sm" label="Cargando productos..." />
                        </div>
                      ) : orderDetail?.items && orderDetail.items.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {orderDetail.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-default-50 rounded-xl p-3"
                            >
                              {/* Imagen del producto */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-default-100 flex-shrink-0 border border-default-200">
                                {item.product?.image ? (
                                  <Image
                                    src={item.product.image}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                    removeWrapper
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl">
                                    📦
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-snug line-clamp-2">
                                  {item.product?.name ?? "Producto"}
                                </p>
                                <p className="text-xs text-default-400 mt-0.5">
                                  Cantidad:&nbsp;
                                  <span className="font-medium text-default-600">
                                    {item.quantity}
                                  </span>
                                </p>
                                <p className="text-xs text-default-400">
                                  Precio unit.:&nbsp;
                                  <span className="font-medium text-default-600">
                                    S/ {Number(item.unitPrice ?? 0).toFixed(2)}
                                  </span>
                                </p>
                              </div>

                              {/* Subtotal */}
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-base">
                                  S/ {Number(item.priceTotal ?? 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Línea de total */}
                          <div className="flex justify-between items-center bg-primary/10 rounded-xl px-4 py-3 mt-1">
                            <span className="font-semibold text-sm">
                              Total del pedido
                            </span>
                            <span className="font-bold text-lg text-primary">
                              S/ {orderDetail.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-default-400">
                          <span className="text-4xl">📋</span>
                          <p className="mt-2 text-sm">
                            No se encontraron productos
                          </p>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ── Línea de tiempo ── */}
                    <div>
                      <h3 className="font-semibold text-xs text-default-400 uppercase tracking-wider mb-3">
                        🕐 Línea de tiempo
                      </h3>
                      <div className="flex flex-col gap-2 text-sm">
                        {[
                          {
                            label: "Asignado",
                            date: selectedDelivery.assignedAt,
                            icon: "📌",
                          },
                          {
                            label: "Aceptado",
                            date: selectedDelivery.acceptedAt,
                            icon: "✅",
                          },
                          {
                            label: "Recogido",
                            date: selectedDelivery.pickedUpAt,
                            icon: "🏪",
                          },
                          {
                            label: "En camino",
                            date: selectedDelivery.outForDeliveryAt,
                            icon: "🚴",
                          },
                          {
                            label: "Llegó al destino",
                            date: selectedDelivery.arrivedAt,
                            icon: "📍",
                          },
                          {
                            label: "Entregado",
                            date: selectedDelivery.deliveredAt,
                            icon: "🎉",
                          },
                          {
                            label: "Cancelado",
                            date: selectedDelivery.cancelledAt,
                            icon: "❌",
                          },
                        ]
                          .filter((step) => step.date)
                          .map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-base w-6 text-center flex-shrink-0">
                                {step.icon}
                              </span>
                              <div className="flex-1 flex justify-between items-center bg-default-50 rounded-lg px-3 py-2">
                                <span className="font-medium text-default-700">
                                  {step.label}
                                </span>
                                <span className="text-default-400 text-xs">
                                  {formatDate(step.date)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>

                      {selectedDelivery.cancellationReason && (
                        <div className="mt-3 bg-danger/10 border border-danger/20 rounded-lg px-3 py-2 text-sm text-danger-700">
                          <span className="font-semibold">Motivo de cancelación: </span>
                          {selectedDelivery.cancellationReason}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
