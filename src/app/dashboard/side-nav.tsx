'use client'

import { Button } from "@/components/ui/button"
import { FileIcon, StarIcon, Trash } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SideNav() {
    const pathname = usePathname()
    return (
        <div className="w-40 flex-col gap-4">
        <Link href="/dashboard/files">
          <Button variant={"ghost"} className={`flex gap-2 hover:text-blue-500 ${pathname.includes("/dashboard/files") ? 'text-blue-500' : 'hover:text-black'} `}>
            <FileIcon /> All Files
          </Button>
        </Link>

        <Link href="/dashboard/favourites" className=" hover:text-blue-500">
          <Button variant={"ghost"} className={`flex gap-2 hover:text-blue-500 ${pathname.includes("/dashboard/favourites") ? 'text-blue-500' : 'hover:text-black'} `}>
            <StarIcon /> Favourites
          </Button>
        </Link>

        <Link href="/dashboard/trash">
          <Button variant={"ghost"} className={`flex gap-2 hover:text-blue-500 ${pathname.includes("/dashboard/trash") ? 'text-blue-500' : 'hover:text-black'} `}>
            <Trash /> Trash
          </Button>
        </Link>
      </div>
    )
}