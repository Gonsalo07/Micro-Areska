import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { SidebarUser } from "./sidebar-user";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className={Sidebar.Body()}>
          <SidebarItem
            title="Home"
            icon={<HomeIcon />}
            isActive={pathname === "/"}
            href="/"
          />
          <SidebarMenu title="Menú Principal">
            <SidebarItem
              isActive={pathname === "/pedidos"}
              title="Pedidos"
              icon={<PaymentsIcon />}
              href="/pedidos"
            />
            <SidebarItem
              isActive={pathname === "/en-ruta"}
              title="En Ruta"
              icon={<ReportsIcon />}
              href="/en-ruta"
            />
            <SidebarItem
              isActive={pathname === "/historial"}
              title="Historial"
              icon={<FilterIcon />}
              href="/historial"
            />
          </SidebarMenu>
        </div>
        <SidebarUser />
      </div>
    </aside>
  );
};
