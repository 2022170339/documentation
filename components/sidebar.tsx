"use client"

import { navigation } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Sidebar({
  data,
}: {
  data: InferSelectModel<typeof navigation>,
}) {
  const path = usePathname();

  if (!data) return null;

  const navigations = JSON.parse(JSON.stringify(data?.structure)).navigation as {
    id: number;
    isHeader: boolean;
    label: string;
    url?: string;
  }[]


  return (
    <ul className="flex h-full w-full flex-col gap-2 [&_li]:mb-0 bg-white z-50 opacity-100">
      {
        navigations.map((item, index) => {
          if (item.isHeader) {
            return (
              <li key={index} className="text-lg font-bold">
                {item.label}
              </li>
            )
          } else {
            return (
              <li key={index}>
                <Link className={`${"hover:underline"} ${path.includes(item.label) ? "underline" : ""}`} href={"/" + item.url || "#"}>
                  {item.label}
                </Link>
              </li>
            )
          }
        })
      }
    </ul>
  )
}