import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import { Search } from "lucide-react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { DarkModeSwitch } from "./darkmodeswitch";
import { NotificationsDropdown } from "./notifications-dropdown";
import { AvailabilityToggle } from "./availability-toggle";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-background min-h-full">
      <Navbar
        isBordered
        className="w-full bg-background/60 backdrop-blur-md border-b-[0.5px] border-default-200/50"
        classNames={{
          wrapper: "w-full max-w-full px-6",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <Input
            size="md"
            radius="lg"
            isClearable
            className="w-full sm:max-w-[400px]"
            classNames={{
              base: "h-10",
              mainWrapper: "h-10",
              inputWrapper:
                "h-10 min-h-10 px-3 bg-default-100 hover:bg-default-200 group-data-[focus=true]:bg-default-100 border border-default-200/60 shadow-sm transition-colors",
              input: "text-sm",
            }}
            placeholder="Buscar pedidos, direcciones..."
            startContent={
              <Search className="h-[18px] w-[18px] text-default-400" strokeWidth={1.75} />
            }
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit flex-grow-0 basis-auto gap-0 data-[justify=end]:flex-grow-0"
        >
          <div className="flex items-center gap-2">
            <AvailabilityToggle variant="icon" />
            <DarkModeSwitch />
            <NotificationsDropdown />
          </div>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
