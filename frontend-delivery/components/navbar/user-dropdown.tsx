import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const UserDropdown = () => {
  const router = useRouter();
  const { logout, driver } = useAuthStore();

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/login");
  }, [logout, router]);

  const handleAction = useCallback(
    (key: React.Key) => {
      if (key === "settings") router.push("/accounts");
      if (key === "logout") handleLogout();
    },
    [router, handleLogout]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          className='p-0 min-w-unit-8 h-auto'
        >
          <Avatar
            color='secondary'
            size='md'
            src='/casco.jpeg'
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={handleAction}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Conectado como</p>
          <p>{driver?.email ?? 'Usuario'}</p>
        </DropdownItem>
        <DropdownItem key='settings'>Configuración</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'>
          Cerrar Sesión
        </DropdownItem>
        <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
