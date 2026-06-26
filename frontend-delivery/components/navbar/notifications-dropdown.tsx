import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { Bell } from "lucide-react";

const navIconButtonClass =
  "min-w-8 w-8 h-8 mr-3 text-default-500 data-[hover=true]:bg-default-100";

export const NotificationsDropdown = () => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="Notificaciones"
          className={navIconButtonClass}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Notificaciones">
        <DropdownSection title="Notificaciones">
          <DropdownItem
            classNames={{
              base: "py-2",
              title: "text-sm font-medium",
            }}
            key="1"
            description="No tienes notificaciones nuevas por ahora."
          >
            Sin novedades
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
