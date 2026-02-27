"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Spinner,
  Switch,
} from "@nextui-org/react";
import {
  Bike,
  Car,
  IdCard,
  Building2,
  Phone,
  User,
  Save,
  WifiOff,
  Wifi,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { deliveryDriverApi } from "@/features/delivery/api/delivery-driver";

const VEHICLE_TYPES = [
  { key: "Moto",      label: "Moto" },
  { key: "Bicicleta", label: "Bicicleta" },
  { key: "Auto",      label: "Auto" },
  { key: "Van",       label: "Van / Minivan" },
  { key: "A pie",     label: "A pie" },
];

export const Accounts = () => {
  const { driver, refreshDriver } = useAuthStore();

  // ── Personal ──────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savedPersonal,  setSavedPersonal]  = useState(false);

  // ── Vehículo ──────────────────────────────────────────────────
  const [vehicleType,    setVehicleType]    = useState("");
  const [licenseNumber,  setLicenseNumber]  = useState("");
  const [companyName,    setCompanyName]    = useState("");
  const [savingVehicle,  setSavingVehicle]  = useState(false);
  const [savedVehicle,   setSavedVehicle]   = useState(false);

  // ── Disponibilidad ────────────────────────────────────────────
  const [isAvailable,    setIsAvailable]    = useState(false);
  const [savingAvail,    setSavingAvail]    = useState(false);

  // inicializar desde el store
  useEffect(() => {
    if (!driver) return;
    setFullName(driver.fullName ?? "");
    setPhone(driver.phone ?? "");
    setVehicleType(driver.vehicleType ?? "");
    setLicenseNumber(driver.licenseNumber ?? "");
    setCompanyName(driver.companyName ?? "");
    setIsAvailable(driver.isAvailable ?? false);
  }, [driver]);

  const flashSaved = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const handleSavePersonal = async () => {
    if (!driver?.id) return;
    setSavingPersonal(true);
    try {
      await deliveryDriverApi.update(driver.id, { fullName, phone });
      await refreshDriver();
      flashSaved(setSavedPersonal);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveVehicle = async () => {
    if (!driver?.id) return;
    setSavingVehicle(true);
    try {
      await deliveryDriverApi.update(driver.id, {
        vehicleType:   vehicleType || undefined,
        licenseNumber: licenseNumber || undefined,
        companyName:   companyName || undefined,
      });
      await refreshDriver();
      flashSaved(setSavedVehicle);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleToggleAvailability = async (val: boolean) => {
    if (!driver?.id) return;
    setIsAvailable(val);
    setSavingAvail(true);
    try {
      await deliveryDriverApi.updateAvailability(driver.id, val);
      await refreshDriver();
    } catch (e) {
      console.error(e);
      setIsAvailable(!val); // revert on error
    } finally {
      setSavingAvail(false);
    }
  };

  if (!driver) {
    return (
      <div className="h-full flex items-center justify-center">
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

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* ── Header de perfil ── */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-none bg-gradient-to-tr from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
        <CardBody className="flex flex-row items-center gap-5 py-5 px-6">
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
              driver.isAvailable ? (
                <Wifi size={12} />
              ) : (
                <WifiOff size={12} />
              )
            }
          >
            {driver.isAvailable ? "Disponible" : "No disponible"}
          </Chip>
        </CardBody>
      </Card>

      {/* ── Datos personales ── */}
      <Card className="col-span-1 border-t-4 border-t-primary/20">
        <CardBody className="px-6 pt-5 pb-0">
          <h3 className="font-semibold text-base">Datos personales</h3>
          <p className="text-xs text-default-400">
            Nombre y número de contacto visibles en tus entregas
          </p>
        </CardBody>
        <Divider />
        <CardBody className="flex flex-col gap-4 px-6 py-5">
          <Input
            label="Nombre completo"
            placeholder="Tu nombre"
            value={fullName}
            onValueChange={setFullName}
            startContent={<User size={15} className="text-default-400" />}
            variant="bordered"
          />
          <Input
            label="Teléfono"
            placeholder="Ej: 999-888-777"
            value={phone}
            onValueChange={setPhone}
            startContent={<Phone size={15} className="text-default-400" />}
            variant="bordered"
          />
          <div className="flex justify-end">
            <Button
              color={savedPersonal ? "success" : "primary"}
              size="sm"
              startContent={<Save size={14} />}
              isLoading={savingPersonal}
              onPress={handleSavePersonal}
            >
              {savedPersonal ? "¡Guardado!" : "Guardar cambios"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ── Datos del vehículo / operación ── */}
      <Card className="col-span-1 border-t-4 border-t-secondary/20">
        <CardBody className="px-6 pt-5 pb-0">
          <h3 className="font-semibold text-base">Datos del vehículo</h3>
          <p className="text-xs text-default-400">
            Información sobre tu medio de transporte y empresa
          </p>
        </CardBody>
        <Divider />
        <CardBody className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-default-600 pl-1">Tipo de vehículo</label>
            <div className="flex items-center gap-2 border-2 border-default-200 rounded-xl px-3 py-2 hover:border-default-400 transition-colors">
              <Bike size={15} className="text-default-400 shrink-0" />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-foreground"
              >
                <option value="">Selecciona tu vehículo</option>
                {VEHICLE_TYPES.map((v) => (
                  <option key={v.key} value={v.key}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="N° de licencia / placa"
            placeholder="Ej: LIC-MOTO-001 o ABC-123"
            value={licenseNumber}
            onValueChange={setLicenseNumber}
            startContent={<IdCard size={15} className="text-default-400" />}
            variant="bordered"
          />

          <Input
            label="Empresa / Flota"
            placeholder="Ej: Areska Express"
            value={companyName}
            onValueChange={setCompanyName}
            startContent={<Building2 size={15} className="text-default-400" />}
            variant="bordered"
          />

          <div className="flex justify-end">
            <Button
              color={savedVehicle ? "success" : "primary"}
              size="sm"
              startContent={<Save size={14} />}
              isLoading={savingVehicle}
              onPress={handleSaveVehicle}
            >
              {savedVehicle ? "¡Guardado!" : "Guardar cambios"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ── Disponibilidad ── */}
      <Card className="col-span-1 border-t-4 border-t-success/20">
        <CardBody className="px-6 pt-5 pb-0">
          <h3 className="font-semibold text-base">Disponibilidad</h3>
          <p className="text-xs text-default-400">
            Activa esto para recibir nuevas órdenes de entrega
          </p>
        </CardBody>
        <Divider />
        <CardBody className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">
                {isAvailable ? "Estoy disponible" : "No estoy disponible"}
              </p>
              <p className="text-xs text-default-400 mt-0.5">
                {isAvailable
                  ? "Puedes recibir nuevas asignaciones"
                  : "No recibirás nuevas órdenes mientras esté desactivado"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {savingAvail && <Spinner size="sm" />}
              <Switch
                isSelected={isAvailable}
                onValueChange={handleToggleAvailability}
                color="success"
                size="lg"
                isDisabled={savingAvail}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Info de cuenta (solo lectura) ── */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardBody className="px-6 pt-5 pb-0">
          <h3 className="font-semibold text-base">Información de cuenta</h3>
          <p className="text-xs text-default-400">Datos de solo lectura</p>
        </CardBody>
        <Divider />
        <CardBody className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 text-sm border-r border-default-200 pr-4 last:border-r-0">
            <span className="text-default-500">Email</span>
            <span className="font-medium truncate" title={driver.email ?? ""}>{driver.email || "—"}</span>
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
            <div className="flex gap-2">
              <Chip
                size="sm"
                variant="flat"
                color={driver.emailVerified ? "success" : "warning"}
              >
                {driver.emailVerified ? "Verificado" : "Sin verificar"}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={driver.isActive ? "success" : "danger"}
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
  );
};
