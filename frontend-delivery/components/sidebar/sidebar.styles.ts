import { tv } from "@nextui-org/react";

export const SidebarWrapper = tv({
  base: "bg-background/95 backdrop-blur-xl transition-transform h-full fixed -translate-x-full w-72 shrink-0 z-[202] overflow-y-auto border-r border-dashed border-default-200/50 flex-col py-8 px-4 md:ml-0 md:flex md:static md:h-screen md:translate-x-0",

  variants: {
    collapsed: {
      true: "translate-x-0 ml-0 [display:inherit]",
    },
  },
});
export const Overlay = tv({
  base: "bg-zinc-900/50 backdrop-blur-sm fixed inset-0 z-[201] opacity-0 pointer-events-none transition-opacity data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto md:hidden",
});

export const Header = tv({
  base: "flex gap-4 items-center px-2 pb-8",
});

export const Body = tv({
  base: "flex flex-col gap-4 px-2",
});

export const Footer = tv({
  base: "flex items-center justify-center gap-4 pt-8 pb-4 border-t border-dashed border-default-200/50 mt-auto",
});

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
});
