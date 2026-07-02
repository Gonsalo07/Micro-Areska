"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Input,
  Button,
  Image,
  Divider,
  Avatar,
} from "@nextui-org/react";
import {
  Eye,
  Search,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Package,
  ClipboardList,
  Clock,
  Pin,
  CheckCircle2,
  Store,
  Bike,
  CircleCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AppModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/app-modal";
import { ButtonStartIcon } from "@/components/button-start-icon";
import { TablePagination } from "@/components/table-pagination";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { orderDeliveriesApi } from "@/features/delivery/api/order-deliveries";
import { ordersApi } from "@/features/delivery/api/orders";
import type { OrderDeliveryDetailResponse, OrderResponse } from "@/lib/types/order";

const searchInputClassNames = {
  base: "h-11",
  mainWrapper: "h-11",
  inputWrapper:
    "h-11 min-h-11 px-3 bg-default-100 hover:bg-default-200 group-data-[focus=true]:bg-default-100 border border-default-200/60 shadow-sm transition-colors",
  input: "text-sm",
};

const modalSectionTitleClass =
  "mb-3 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-default-400";

function ModalSectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <h3 className={modalSectionTitleClass}>
      <Icon size={14} strokeWidth={1.75} />
      {children}
    </h3>
  );
}

export default function HistorialPage() {
  const { driver } = useAuthStore();
  const [deliveries, setDeliveries] = useState<OrderDeliveryDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  // Modal de detalle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<OrderDeliveryDetailResponse | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const fetchHistory = useCallback(async () => {
    if (!driver?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await orderDeliveriesApi.getDriverHistory(driver.id, {
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
      });
      setDeliveries(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setDeliveredCount(data.deliveredCount);
      setCancelledCount(data.cancelledCount);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [driver?.id, page, pageSize, debouncedSearch]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const handleViewDetail = async (delivery: OrderDeliveryDetailResponse) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
    setOrderDetail(null);
    setLoadingDetail(true);
    try {
      const order = await ordersApi.getById(delivery.orderId);
      if (order && typeof order === "object" && "id" in order) {
        setOrderDetail(order);
      }
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

  if (loading && deliveries.length === 0 && totalElements === 0 && !debouncedSearch) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Cargando historial..." />
      </div>
    );
  }

  const hasAnyHistory = deliveredCount + cancelledCount > 0;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Historial de Entregas</h1>
          <p className="text-default-500 text-sm">
            {deliveredCount} entregas completadas
          </p>
        </div>
        <Input
          placeholder="Buscar por # de orden o cliente..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="w-72 shrink-0"
          size="md"
          radius="lg"
          isClearable
          classNames={searchInputClassNames}
          startContent={
            <Search className="h-[18px] w-[18px] shrink-0 text-default-400" strokeWidth={1.75} />
          }
        />
      </div>

      {/* Tabla */}
      {!hasAnyHistory && !debouncedSearch ? (
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
            th: "text-sm text-foreground-500 font-semibold",
          }}
          bottomContent={
            totalElements > 0 ? (
              <TablePagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(0);
                }}
              />
            ) : null
          }
          bottomContentPlacement="outside"
        >
          <TableHeader>
            <TableColumn># Orden</TableColumn>
            <TableColumn>Cliente</TableColumn>
            <TableColumn>Fecha Entrega</TableColumn>
            <TableColumn>Destino</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              loading ? (
                <Spinner size="sm" label="Cargando..." />
              ) : (
                "No hay entregas que mostrar"
              )
            }
          >
            {deliveries.map((delivery) => (
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
                  <span
                    className={
                      delivery.status === "DELIVERED"
                        ? "text-sm font-medium text-success-600"
                        : "text-sm font-medium text-danger-600"
                    }
                  >
                    {delivery.status === "DELIVERED"
                      ? "Entregado ✓"
                      : delivery.status === "CANCELLED"
                      ? "Cancelado ✗"
                      : delivery.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="md"
                    variant="light"
                    color="primary"
                    radius="md"
                    className="h-9 min-h-9 shrink-0 gap-2 px-4 text-sm font-semibold bg-transparent text-primary hover:bg-primary/10 data-[hover=true]:bg-primary/10"
                    startContent={<ButtonStartIcon icon={Eye} size={15} />}
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
      {hasAnyHistory && (
        <div className="flex gap-4 justify-end">
          <div className="bg-default-100 px-4 py-2 rounded-lg">
            <span className="text-default-500 text-sm">Total entregas: </span>
            <span className="font-bold">{deliveredCount + cancelledCount}</span>
          </div>
          <div className="bg-default-100 px-4 py-2 rounded-lg">
            <span className="text-success-600 text-sm">Completadas: </span>
            <span className="font-bold text-success-600">{deliveredCount}</span>
          </div>
          {cancelledCount > 0 && (
            <div className="bg-default-100 px-4 py-2 rounded-lg">
              <span className="text-danger-600 text-sm">Canceladas: </span>
              <span className="font-bold text-danger-600">{cancelledCount}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Modal de Detalle ── */}
      <AppModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 pt-1">
                <div className="min-h-8" aria-hidden />
                <div className="flex w-full items-center gap-3">
                  <span className="text-lg font-bold min-w-0 truncate">
                    Detalle — Orden #{selectedDelivery?.orderId}
                  </span>
                  {selectedDelivery && (
                    <span
                      className={`ml-auto shrink-0 text-sm font-medium ${
                        selectedDelivery.status === "DELIVERED"
                          ? "text-success-600"
                          : "text-danger-600"
                      }`}
                    >
                      {selectedDelivery.status === "DELIVERED"
                        ? "Entregado ✓"
                        : "Cancelado ✗"}
                    </span>
                  )}
                </div>
              </ModalHeader>

              <ModalBody className="pb-6">
                {selectedDelivery && (
                  <div className="flex flex-col gap-5">
                    {/* ── Información del cliente ── */}
                    <div className="bg-default-50 rounded-xl p-4">
                      <ModalSectionTitle icon={User}>
                        Información del cliente
                      </ModalSectionTitle>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <Avatar
                            name={selectedDelivery.customerName || "?"}
                            size="md"
                            color="primary"
                            isBordered
                            className="shrink-0"
                          />
                          <div className="flex flex-col gap-1.5">
                            <p className="font-semibold text-base leading-tight">
                              {selectedDelivery.customerName || "Sin nombre"}
                            </p>
                            <p className="flex items-center gap-1.5 text-sm text-default-500">
                              <Phone size={14} className="shrink-0 text-default-400" strokeWidth={1.75} />
                              {selectedDelivery.customerPhone || "Sin teléfono"}
                            </p>
                          </div>
                        </div>
                        {selectedDelivery.destinationAddress && (
                          <div className="ml-auto flex max-w-[50%] shrink-0 items-center justify-end gap-2 text-right text-sm">
                            <MapPin size={14} className="shrink-0 text-default-400" strokeWidth={1.75} />
                            <p className="text-default-700">
                              {selectedDelivery.destinationAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {/* ── Productos del pedido ── */}
                    <div>
                      <ModalSectionTitle icon={ShoppingBag}>
                        Productos del pedido
                      </ModalSectionTitle>

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
                                  <div className="flex h-full w-full items-center justify-center text-default-400">
                                    <Package size={24} strokeWidth={1.75} />
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
                        <div className="flex flex-col items-center py-6 text-default-400">
                          <ClipboardList size={36} strokeWidth={1.5} />
                          <p className="mt-2 text-sm">
                            No se encontraron productos
                          </p>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ── Línea de tiempo ── */}
                    <div>
                      <ModalSectionTitle icon={Clock}>
                        Línea de tiempo
                      </ModalSectionTitle>
                      <div className="flex flex-col gap-2 text-sm">
                        {(
                          [
                            {
                              label: "Asignado",
                              date: selectedDelivery.assignedAt,
                              icon: Pin,
                            },
                            {
                              label: "Aceptado",
                              date: selectedDelivery.acceptedAt,
                              icon: CheckCircle2,
                            },
                            {
                              label: "Recogido",
                              date: selectedDelivery.pickedUpAt,
                              icon: Store,
                            },
                            {
                              label: "En camino",
                              date: selectedDelivery.outForDeliveryAt,
                              icon: Bike,
                            },
                            {
                              label: "Llegó al destino",
                              date: selectedDelivery.arrivedAt,
                              icon: MapPin,
                            },
                            {
                              label: "Entregado",
                              date: selectedDelivery.deliveredAt,
                              icon: CircleCheck,
                            },
                            {
                              label: "Cancelado",
                              date: selectedDelivery.cancelledAt,
                              icon: XCircle,
                            },
                          ] as const
                        )
                          .filter((step) => step.date)
                          .map((step) => {
                            const StepIcon = step.icon;
                            return (
                            <div key={step.label} className="flex items-center gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-default-500">
                                <StepIcon size={16} strokeWidth={1.75} />
                              </span>
                              <div className="flex flex-1 items-center justify-between rounded-lg bg-default-50 px-3 py-2">
                                <span className="font-medium text-default-700">
                                  {step.label}
                                </span>
                                <span className="text-xs text-default-400">
                                  {formatDate(step.date)}
                                </span>
                              </div>
                            </div>
                            );
                          })}
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
                <Button
                  variant="light"
                  size="md"
                  radius="lg"
                  className="h-10 min-h-10 shrink-0 px-5"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </AppModal>
    </div>
  );
}
