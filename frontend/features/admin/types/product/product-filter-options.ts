import type { Option } from '@/lib/schemas/common/option.schema'

export interface ProductFilterOptions {
  categories: Option[]
}

export type ProductFilterOptionsParams = Partial<ProductFilterOptions>
