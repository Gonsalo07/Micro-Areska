"use client";

import {
  Avatar,
  Button,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ProfilePanel } from "@/components/accounts/profile-panel";
import {
  AppModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/app-modal";
import { AvailabilityToggle } from "@/components/navbar/availability-toggle";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const iconButtonClass =
  "min-w-8 w-8 h-8 text-default-500 data-[hover=true]:bg-default-100";

export function SidebarUser() {
  const router = useRouter();
  const { driver, logout } = useAuthStore();
  const profileModal = useDisclosure();
  const logoutModal = useDisclosure();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [logout, router]);

  return (
    <>
      <div className="mt-auto flex shrink-0 flex-col gap-2 px-2">
        <AvailabilityToggle
          showLabel
          fullWidth
          tooltipPlacement="top"
          offlineLabel="Fuera de línea"
        />
        <div className="flex shrink-0 items-center gap-3 border-t border-default-200 pt-4 dark:border-default-100/20">
        <Avatar
          color="secondary"
          size="sm"
          src="/casco.jpeg"
          className="h-9 w-9 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-default-900 dark:text-white">
            {driver?.fullName ?? "Conductor"}
          </p>
          <p className="truncate text-xs text-default-500">
            {driver?.email ?? "Usuario"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip content="Perfil" placement="top">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Perfil"
              className={iconButtonClass}
              onPress={profileModal.onOpen}
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Button>
          </Tooltip>
          <Tooltip content="Cerrar sesión" placement="top" color="danger">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Cerrar sesión"
              className={`${iconButtonClass} text-danger data-[hover=true]:bg-danger/10`}
              onPress={logoutModal.onOpen}
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Button>
          </Tooltip>
        </div>
        </div>
      </div>

      <AppModal
        isOpen={profileModal.isOpen}
        onOpenChange={profileModal.onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          body: "px-4 py-2",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Mi perfil</span>
              </ModalHeader>
              <ModalBody>
                <ProfilePanel layout="modal" />
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

      <AppModal
        isOpen={logoutModal.isOpen}
        onOpenChange={logoutModal.onOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span>Cerrar sesión</span>
                <p className="text-sm font-normal text-default-500">
                  ¿Estás seguro de que deseas cerrar sesión?
                </p>
              </ModalHeader>
              <ModalFooter className="gap-3">
                <Button
                  variant="light"
                  size="md"
                  radius="lg"
                  className="h-10 min-h-10 shrink-0 px-5"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  size="md"
                  radius="lg"
                  className="h-10 min-h-10 shrink-0 px-5 font-semibold"
                  onPress={() => {
                    onClose();
                    void handleLogout();
                  }}
                >
                  Cerrar sesión
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </AppModal>
    </>
  );
}
