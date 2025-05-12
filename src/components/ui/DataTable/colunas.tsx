"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AccountsPayable = {
  id: number,
  header: string,
  type: string,
  status: string,
  target: string,
  limit: string,
  reviewer: string
}

export const columns: ColumnDef<AccountsPayable>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "header",
    header: "header",
  },
  {
    accessorKey: "type",
    header: "type",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "target",
    header: "target",
  },
  {
    accessorKey: "limit",
    header: "limit",
  },
  {
    accessorKey: "reviewer",
    header: "reviewer",
  },
]
