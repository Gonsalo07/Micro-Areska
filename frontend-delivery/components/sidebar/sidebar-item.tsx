import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };

  return (
    <NextLink
      href={href}
      className="text-default-900 active:bg-none max-w-full"
      onClick={handleClick}
    >
      <div
        className={clsx(
          isActive
            ? "bg-primary-100/50 text-primary-600 font-bold [&_svg_path]:fill-primary-500 shadow-sm"
            : "hover:bg-default-100 text-default-500 hover:text-default-900 font-medium",
          "flex gap-3 w-full min-h-[44px] h-full items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98]"
        )}
      >
        <div className={clsx("w-6 transition-transform", isActive ? "scale-110" : "opacity-70 group-hover:opacity-100")}>
          {icon}
        </div>
        <span className="leading-none">{title}</span>
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    </NextLink>
  );
};
