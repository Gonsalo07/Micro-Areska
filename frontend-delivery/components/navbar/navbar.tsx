import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { AvailabilityToggle } from "./availability-toggle";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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
            startContent={<SearchIcon />}
            isClearable
            className="w-full sm:max-w-[400px]"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
              inputWrapper: "bg-default-100 hover:bg-default-200 group-data-[focus=true]:bg-default-100 transition-colors"
            }}
            placeholder="Buscar..."
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <NotificationsDropdown />

          <AvailabilityToggle />

          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
