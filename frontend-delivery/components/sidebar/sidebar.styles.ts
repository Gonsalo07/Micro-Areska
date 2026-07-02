import { tv } from "@nextui-org/react";

export const SidebarWrapper = tv({
  base: "bg-default-100 dark:bg-zinc-950 transition-transform h-full fixed -translate-x-full w-72 shrink-0 z-[202] overflow-hidden border-r border-default-200 dark:border-default-100/20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.35)] flex flex-col py-8 px-4 md:ml-0 md:static md:h-screen md:translate-x-0",

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
  base: "flex flex-1 flex-col gap-4 overflow-y-auto px-2 min-h-0",
});

export const Footer = tv({
  base: "mt-auto flex shrink-0 items-center gap-3 border-t border-default-200 px-2 pt-4 dark:border-default-100/20",
});

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
});
