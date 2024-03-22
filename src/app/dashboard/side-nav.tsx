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
          <Button variant={"link"} className={`flex gap-2 ${pathname.includes("/dashboard/files") ? 'text-blue-500' : ''}`}>
            <FileIcon /> All Files
          </Button>
        </Link>

        <Link href="/dashboard/favourites">
          <Button variant={"link"} className={`flex gap-2 ${pathname.includes("/dashboard/favourites") ? 'text-blue-500' : ''} `}>
            <StarIcon /> Favourites
          </Button>
        </Link>

        <Link href="/dashboard/trash">
          <Button variant={"link"} className={`flex gap-2 ${pathname.includes("/dashboard/trash") ? 'text-blue-500' : ''} `}>
            <Trash /> Trash
          </Button>
        </Link>
      </div>
    )
}