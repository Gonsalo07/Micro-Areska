"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  AppModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/app-modal";
import {
  Bike,
  IdCard,
  Building2,
  Phone,
  User,
  Save,
  WifiOff,
  Wifi,
  Pencil,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { deliveryDriverApi } from "@/features/delivery/api/delivery-driver";
import { ButtonStartIcon } from "@/components/button-start-icon";
import { PrimaryButton } from "@/components/primary-button";
import { cn } from "@/lib/utils";

const VEHICLE_TYPES = [
  { key: "Moto", label: "Moto" },
  { key: "Bicicleta", label: "Bicicleta" },
  { key: "Auto", label: "Auto" },
  { key: "Van", label: "Van / Minivan" },
  { key: "A pie", label: "A pie" },
];

const accountInputClassNames = {
  label: "text-sm font-medium pb-1.5",
  inputWrapper: "min-h-11 h-11",
  input: "text-sm pt-0",
};

const modalFooterBtnClass = "h-10 min-h-10 shrink-0 px-5";

const flatChipLightBg: Record<string, string> = {
  success: "!bg-success/10",
  warning: "!bg-warning/10",
  danger: "!bg-danger/10",
};
const cardActionBtnClass = "px-10";
const cardHeaderRowClass = "mb-1.5 flex min-w-0 items-baseline gap-x-2";
const cardHeaderSubtitleClass = "min-w-0 truncate text-xs text-default-400";

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-default-500">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

function VehicleTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-default-600 pl-0.5 pb-0.5">
        Tipo de vehículo
      </label>
      <div className="flex items-center gap-2 border-2 border-default-200 rounded-xl px-3 py-2 min-h-11 hover:border-default-400 transition-colors">
        <Bike size={15} className="text-default-400 shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none text-foreground"
        >
          <option value="">Selecciona tu vehículo</option>
          {VEHICLE_TYPES.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

type ProfilePanelProps = {
  layout?: "page" | "modal";
  className?: string;
};

export function ProfilePanel({ layout = "page", className }: ProfilePanelProps) {
  const { driver, refreshDriver } = useAuthStore();

  const personalModal = useDisclosure();
  const vehicleModal = useDisclosure();

  const [personalDraft, setPersonalDraft] = useState({ fullName: "", phone: "" });
  const [vehicleDraft, setVehicleDraft] = useState({
    vehicleType: "",
    licenseNumber: "",
    companyName: "",
  });

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);

  const openPersonalModal = () => {
    if (!driver) return;
    setPersonalDraft({
      fullName: driver.fullName ?? "",
      phone: driver.phone ?? "",
    });
    personalModal.onOpen();
  };

  const openVehicleModal = () => {
    if (!driver) return;
    setVehicleDraft({
      vehicleType: driver.vehicleType ?? "",
      licenseNumber: driver.licenseNumber ?? "",
      companyName: driver.companyName ?? "",
    });
    vehicleModal.onOpen();
  };

  const handleSavePersonal = async (onClose: () => void) => {
    if (!driver?.id) return;
    setSavingPersonal(true);
    try {
      await deliveryDriverApi.update(driver.id, personalDraft);
      await refreshDriver();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveVehicle = async (onClose: () => void) => {
    if (!driver?.id) return;
    setSavingVehicle(true);
    try {
      await deliveryDriverApi.update(driver.id, {
        vehicleType: vehicleDraft.vehicleType || undefined,
        licenseNumber: vehicleDraft.licenseNumber || undefined,
        companyName: vehicleDraft.companyName || undefined,
      });
      await refreshDriver();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingVehicle(false);
    }
  };

  if (!driver) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="lg" label="Cargando perfil..." />
      </div>
    );
  }

  const initials = driver.fullName
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isModal = layout === "modal";

  return (
    <>
      <div
        className={cn(
          isModal
            ? "flex w-full flex-col gap-4"
            : "grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch",
          className
        )}
      >
        <Card
          className={cn(
            "relative w-full overflow-hidden border-t-4 border-t-primary/20 bg-content1 shadow-medium",
            !isModal && "col-span-1 md:col-span-2"
          )}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute right-1/3 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-primary/15 blur-2xl" />
          </div>
          <CardBody className="relative z-10 flex flex-row items-center gap-5 py-5 px-6">
            <Avatar
              name={initials}
              src={driver.photoUrl ?? undefined}
              size="lg"
              color="primary"
              isBordered
              className="text-xl font-bold"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight truncate">
                {driver.fullName}
              </h2>
              <p className="text-sm text-default-400 truncate">{driver.email}</p>
            </div>
            <Chip
              color={driver.isAvailable ? "success" : "default"}
              variant="flat"
              startContent={
                driver.isAvailable ? <Wifi size={12} /> : <WifiOff size={12} />
              }
            >
              {driver.isAvailable ? "Disponible" : "No disponible"}
            </Chip>
          </CardBody>
        </Card>

        <Card className="col-span-1 flex h-full min-h-0 w-full flex-col border-t-4 border-t-primary/20">
          <CardBody className="shrink-0 px-6 pt-5 pb-0">
            <div className={cardHeaderRowClass}>
              <h3 className="shrink-0 font-semibold text-base">Datos personales</h3>
              <p
                className={cardHeaderSubtitleClass}
                title="Nombre y número de contacto visibles en tus entregas"
              >
                Nombre y número de contacto visibles en tus entregas
              </p>
            </div>
          </CardBody>
          <Divider className="shrink-0" />
          <CardBody className="shrink-0 px-6 pb-5 pt-2">
            <div className="flex flex-col gap-4 pl-3 mt-2">
              <ReadOnlyField label="Nombre completo" value={driver.fullName} />
              <ReadOnlyField label="Teléfono" value={driver.phone} />
            </div>
          </CardBody>
          <div className="mt-auto flex shrink-0 justify-end px-6 pb-5 pt-2">
            <PrimaryButton
              className={cardActionBtnClass}
              startContent={<ButtonStartIcon icon={Pencil} size={14} />}
              onPress={openPersonalModal}
            >
              Editar
            </PrimaryButton>
          </div>
        </Card>

        <Card className="col-span-1 flex h-full min-h-0 w-full flex-col border-t-4 border-t-secondary/20">
          <CardBody className="shrink-0 px-6 pt-5 pb-0">
            <div className={cardHeaderRowClass}>
              <h3 className="shrink-0 font-semibold text-base">Datos del vehículo</h3>
              <p
                className={cardHeaderSubtitleClass}
                title="Información sobre tu medio de transporte y empresa"
              >
                Información sobre tu medio de transporte y empresa
              </p>
            </div>
          </CardBody>
          <Divider className="shrink-0" />
          <CardBody className="shrink-0 px-6 pb-5 pt-2">
            <div className="flex flex-col gap-4 pl-3 mt-2">
              <ReadOnlyField label="Tipo de vehículo" value={driver.vehicleType} />
              <ReadOnlyField label="N° de licencia / placa" value={driver.licenseNumber} />
              <ReadOnlyField label="Empresa / Flota" value={driver.companyName} />
            </div>
          </CardBody>
          <div className="mt-auto flex shrink-0 justify-end px-6 pb-5 pt-2">
            <PrimaryButton
              className={cardActionBtnClass}
              startContent={<ButtonStartIcon icon={Pencil} size={14} />}
              onPress={openVehicleModal}
            >
              Editar
            </PrimaryButton>
          </div>
        </Card>

        <Card className={cn("w-full", !isModal && "col-span-1 md:col-span-2")}>
          <CardBody className="px-6 pt-5 pb-0">
            <div className={cardHeaderRowClass}>
              <h3 className="shrink-0 font-semibold text-base">Información de cuenta</h3>
              <p className={cardHeaderSubtitleClass} title="Datos de solo lectura">
                Datos de solo lectura
              </p>
            </div>
          </CardBody>
          <Divider className="shrink-0" />
          <CardBody
            className={cn(
              "px-6 py-5 grid gap-4",
              isModal ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            <div className="flex flex-col gap-1 text-sm border-r border-default-200 pr-4 last:border-r-0">
              <span className="text-default-500">Email</span>
              <span className="font-medium truncate" title={driver.email ?? ""}>
                {driver.email || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm border-r border-default-200 pr-4 last:border-r-0">
              <span className="text-default-500">Proveedor de auth</span>
              <div className="flex">
                <Chip size="sm" variant="flat" color="default">
                  {driver.authProvider}
                </Chip>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm border-r border-default-200 pr-4 last:border-r-0">
              <span className="text-default-500">Estado de cuenta</span>
              <div className="flex flex-wrap gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={driver.emailVerified ? "success" : "warning"}
                  classNames={{
                    base: flatChipLightBg[driver.emailVerified ? "success" : "warning"],
                  }}
                >
                  {driver.emailVerified ? "Verificado" : "Sin verificar"}
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color={driver.isActive ? "success" : "danger"}
                  classNames={{
                    base: flatChipLightBg[driver.isActive ? "success" : "danger"],
                  }}
                >
                  {driver.isActive ? "Activa" : "Inactiva"}
                </Chip>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <span className="text-default-500">Miembro desde</span>
              <span className="font-medium">
                {new Date(driver.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <AppModal
        isOpen={personalModal.isOpen}
        onOpenChange={personalModal.onOpenChange}
        placement="center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg font-bold">Editar datos personales</span>
                <span className="text-xs font-normal text-default-400">
                  Nombre y contacto visibles en tus entregas
                </span>
              </ModalHeader>
              <ModalBody className="gap-4 pb-2">
                <Input
                  label="Nombre completo"
                  labelPlacement="outside"
                  placeholder="Tu nombre"
                  value={personalDraft.fullName}
                  onValueChange={(v) =>
                    setPersonalDraft((prev) => ({ ...prev, fullName: v }))
                  }
                  startContent={<User size={15} className="text-default-400" />}
                  variant="bordered"
                  classNames={accountInputClassNames}
                />
                <Input
                  label="Teléfono"
                  labelPlacement="outside"
                  placeholder="Ej: 999-888-777"
                  value={personalDraft.phone}
                  onValueChange={(v) =>
                    setPersonalDraft((prev) => ({ ...prev, phone: v }))
                  }
                  startContent={<Phone size={15} className="text-default-400" />}
                  variant="bordered"
                  classNames={accountInputClassNames}
                />
              </ModalBody>
              <ModalFooter className="gap-3 pb-6 pt-1">
                <Button
                  variant="flat"
                  size="md"
                  radius="lg"
                  className={modalFooterBtnClass}
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <PrimaryButton
                  className={`${modalFooterBtnClass} font-semibold`}
                  startContent={<ButtonStartIcon icon={Save} size={14} />}
                  isLoading={savingPersonal}
                  onPress={() => handleSavePersonal(onClose)}
                >
                  Guardar cambios
                </PrimaryButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </AppModal>

      <AppModal
        isOpen={vehicleModal.isOpen}
        onOpenChange={vehicleModal.onOpenChange}
        placement="center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg font-bold">Editar datos del vehículo</span>
                <span className="text-xs font-normal text-default-400">
                  Medio de transporte y empresa asociada
                </span>
              </ModalHeader>
              <ModalBody className="gap-4 pb-2">
                <VehicleTypeSelect
                  value={vehicleDraft.vehicleType}
                  onChange={(v) =>
                    setVehicleDraft((prev) => ({ ...prev, vehicleType: v }))
                  }
                />
                <Input
                  label="N° de licencia / placa"
                  labelPlacement="outside"
                  placeholder="Ej: LIC-MOTO-001 o ABC-123"
                  value={vehicleDraft.licenseNumber}
                  onValueChange={(v) =>
                    setVehicleDraft((prev) => ({ ...prev, licenseNumber: v }))
                  }
                  startContent={<IdCard size={15} className="text-default-400" />}
                  variant="bordered"
                  classNames={accountInputClassNames}
                />
                <Input
                  label="Empresa / Flota"
                  labelPlacement="outside"
                  placeholder="Ej: Areska Express"
                  value={vehicleDraft.companyName}
                  onValueChange={(v) =>
                    setVehicleDraft((prev) => ({ ...prev, companyName: v }))
                  }
                  startContent={<Building2 size={15} className="text-default-400" />}
                  variant="bordered"
                  classNames={accountInputClassNames}
                />
              </ModalBody>
              <ModalFooter className="gap-3 pb-6 pt-1">
                <Button
                  variant="flat"
                  size="md"
                  radius="lg"
                  className={modalFooterBtnClass}
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <PrimaryButton
                  className={`${modalFooterBtnClass} font-semibold`}
                  startContent={<ButtonStartIcon icon={Save} size={14} />}
                  isLoading={savingVehicle}
                  onPress={() => handleSaveVehicle(onClose)}
                >
                  Guardar cambios
                </PrimaryButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </AppModal>
    </>
  );
}
