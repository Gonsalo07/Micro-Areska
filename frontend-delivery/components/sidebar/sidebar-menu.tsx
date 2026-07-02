import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-default-500 dark:text-default-400 px-4 pb-1">
        {title}
      </span>
      {children}
    </div>
  );
};
