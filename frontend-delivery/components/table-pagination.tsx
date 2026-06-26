"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
};

export function TablePagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemLabel = "entrega(s)",
}: TablePaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const currentPage = page + 1;

  return (
    <div className="flex w-full flex-col gap-3 border-t border-default-200 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm text-default-500">
        <span>Mostrar</span>
        <Dropdown
          placement="bottom-start"
          classNames={{ content: "!min-w-0 w-auto p-1" }}
        >
          <DropdownTrigger>
            <Button
              size="sm"
              variant="bordered"
              radius="md"
              aria-label="Filas por página"
              className="h-8 min-h-8 w-12 min-w-12 px-0 text-sm font-normal text-foreground"
            >
              {pageSize}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filas por página"
            selectionMode="single"
            hideSelectedIcon
            className="min-w-0 p-0"
            itemClasses={{
              base: "min-h-8 h-8 px-3 justify-center data-[selected=true]:bg-default-100",
              title: "text-sm tabular-nums",
            }}
            selectedKeys={new Set([String(pageSize)])}
            onAction={(key) => {
              const value = Number(key);
              if (PAGE_SIZE_OPTIONS.includes(value as (typeof PAGE_SIZE_OPTIONS)[number])) {
                onPageSizeChange(value);
              }
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <DropdownItem key={String(size)} textValue={String(size)}>
                {size}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <span>
          {totalElements} {itemLabel} en total
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="text-sm font-semibold text-foreground">
          Página {currentPage} de {safeTotalPages}
        </span>
        <Button
          size="sm"
          variant="bordered"
          radius="md"
          className="h-8 min-h-8 px-3 text-sm font-medium"
          isDisabled={page <= 0}
          onPress={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="bordered"
          radius="md"
          className="h-8 min-h-8 px-3 text-sm font-medium"
          isDisabled={page >= totalPages - 1 || totalPages === 0}
          onPress={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
