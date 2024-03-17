"use client"

import { Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { ScrollArea } from "./ui/scroll-area";
import { usePathname } from "next/navigation";

export default function MobileNav({ data }: { data?: any }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname])

  return (
    <>
      <div className="flex md:hidden">
        <Button onClick={() => setOpen(prev => !prev)} variant="ghost" size="icon">
          <Menu />
        </Button>
      </div>
      {
        open && (
          <div
            className="flex flex-col gap-4 fixed inset-0 bg-white p-8 container w-full h-full z-[999] opacity-100">
            <Button className="ml-auto" onClick={() => setOpen(prev => !prev)} variant="ghost" size="icon">
              <X />
            </Button>
            <ScrollArea>
              <Sidebar data={data} />
            </ScrollArea>
          </div>
        )
      }
    </>
  )
}