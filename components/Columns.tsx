"use client"

import { pages } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import { InferSelectModel } from "drizzle-orm"
import { Button } from "./ui/button"
import Link from "next/link"
import { DeleteAction } from "@/app/manage/edit/[id]/_actions/delete"
import { toast } from "sonner"

export type Page = InferSelectModel<typeof pages>

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: (row) => {
      return (
        <span className="line-clamp-1 max-w-[300px] text-ellipsis">{row.row.getValue("content")}</span>
      );
    }
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row) => {
      return (
        <div className="flex flex-row gap-2">
          <Button asChild>
            <Link href={`/manage/edit/${row.row.getValue("id")}`}>
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={async () => {
            try {
              await DeleteAction(row.row.getValue("id"))
              toast.success("Deleted successfully")
            } catch (e: any) {
              toast.error(e.message)
              return;
            }
          }}>Delete</Button>
        </div>
      );
    }
  }
];