import type { SortDirections } from "@/types/Repository"

export type TableHeader = {
  title: string,
  sort?: {
    field: string,
    direction?: SortDirections
  }
  classList?: string
}

export type TableItem = {
  id: string,
  data: string[]
}

type Icons = 'delete'

export type TableAction = {
  icon: Icons,
  callback: (item: TableItem) => void
}

export type FormEntity<T extends { id: number | string }> = Omit<T, 'id'> & { id: T['id'] | null }