"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ActivityLog } from '@/types/activityLog'
import { formatDate } from '@/lib/formatDate'

export const columns: ColumnDef<ActivityLog>[] = [
 {
   accessorKey: "user.name",
   header: "User",
   cell: ({ row }) => row.original.user?.name || 'Deleted User',
 },
 {
   accessorKey: "action",
   header: "Action",
 },
 {
   accessorKey: "details",
   header: "Details",
 },
 {
   accessorKey: "createdAt",
   header: "Timestamp",
   cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
 },
]

