import type { ColumnDef } from '@tanstack/react-table'

import type { ColumnFilterMeta } from '@admin/types/table.d'

type FilterOption = { label: string; value: string }

export function withMetaLabelFilter<TData>({
  columnId,
  options,
}: {
  columnId: (keyof TData & string) | string
  options: FilterOption[]
}): ColumnDef<TData>['meta'] {
  return {
    filter: {
      columnId,
      options,
      title: '',
    } as ColumnFilterMeta,
  }
}
