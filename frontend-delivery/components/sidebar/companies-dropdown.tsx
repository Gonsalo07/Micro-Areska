"use client";
import React from "react";
import { AcmeIcon } from "../icons/acme-icon";

export const CompaniesDropdown = () => {
  return (
    <div className="flex items-center gap-3 w-full px-2">
      <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
        <AcmeIcon />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-lg font-bold text-default-900 whitespace-nowrap leading-none tracking-tight">
          ARESKA
        </h3>
        <span className="text-[10px] font-semibold text-default-400 uppercase tracking-widest">
          Driver App
        </span>
      </div>
    </div>
  );
};
