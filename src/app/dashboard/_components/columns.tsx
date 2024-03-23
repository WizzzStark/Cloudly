"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { FileCardActions } from "./file_actions"

function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId,
    })
    return (
        <div className="flex gap-2 text-[14px] text-gray-800 font-semibold w-40 items-center">
            <Avatar className="w-6 h-6 rounded-full">
                <AvatarImage src={ userProfile?.image } alt="user image" className="rounded-full h-6 w-6"/>
                <AvatarFallback>WZ</AvatarFallback>
            </Avatar>
            { userProfile?.name }
        </div>
        )
}

export const columns: ColumnDef<Doc<"files"> & {isFavorited: boolean}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "User",
    cell: ({ row }) => {
        return <UserCell userId={row.original.userId} />
      },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Uploaded",
    cell: ({ row }) => {
        return <div className="">{formatRelative((new Date(row.original._creationTime)), new Date())}</div>
      },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
        return <FileCardActions file={row.original} isFavourite={row.original.isFavorited}/>
      },
  }
]
