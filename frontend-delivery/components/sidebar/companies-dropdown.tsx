"use client";
import React from "react";
import { AcmeIcon } from "../icons/acme-icon";

export const CompaniesDropdown = () => {
  return (
    <div className="flex items-center gap-2">
      <AcmeIcon />
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
          Areska Driver
        </h3>
        <span className="text-xs font-medium text-default-500">
          Panel de Entregas
        </span>
      </div>
    </div>
  );
};
