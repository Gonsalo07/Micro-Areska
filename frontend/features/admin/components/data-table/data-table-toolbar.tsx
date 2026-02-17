'use client'

import { Table } from '@tanstack/react-table'
import { Search, Trash, X } from 'lucide-react'

import { getColumnLabel } from '@admin/config/column-labels'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterOption } from '@/lib/types'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  resource: string
}

export function DataTableToolbar<TData>({ table, resource }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const searchCol = table.getAllLeafColumns().find((col) => col.columnDef.meta?.searchable)

  const searchValue =
    (searchCol ? (table.getColumn(searchCol.id)?.getFilterValue() as string) : '') ?? ''

  return (
    <div className="flex flex-wrap items-center justify-between space-x-2 gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {searchCol && (
          <div className="relative">
            <Input
              placeholder={`Buscar por ${getColumnLabel(resource, searchCol.id).toLowerCase()}…`}
              className="pl-9 pr-4 h-8 w-[190px] lg:w-[270px] text-sm"
              value={searchValue}
              onChange={(e) => table.getColumn(searchCol.id)?.setFilterValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {table
          .getAllLeafColumns()
          .filter((col) => col.columnDef.meta?.filter)
          .map((col) => {
            const { title, options } = col.columnDef.meta!.filter! as {
              title: string
              options: FilterOption[]
            }

            return (
              <DataTableFacetedFilter
                key={col.id}
                column={col}
                title={title}
                options={options}
                table={table}
              />
            )
          })}

        {isFiltered && (
          <Button
            className="border-dashed"
            variant="outline"
            size="sm"
            onClick={() => {
              table.resetColumnFilters()
            }}
          >
            Resetear
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive data-[highlighted]:text-destructive"
          >
            <Trash aria-hidden="true" className="text-current" />
            Eliminar ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} resource={resource} />
      </div>
    </div>
  )
}
