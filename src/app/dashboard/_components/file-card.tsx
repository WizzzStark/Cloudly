import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"


import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Doc} from "../../../../convex/_generated/dataModel"
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { formatRelative } from 'date-fns'
import { FileCardActions, getFileUrl } from "./file_actions"


export function FileCard({ file }: { file: Doc<"files"> & {isFavorited: boolean}}){

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      } as Record<Doc<"files">["type"], ReactNode>;

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });    

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-base font-semibold">
                    <p className="text-center flex justify-center">{typeIcons[file.type]}</p>
                    {file.name} 
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} isFavourite={file.isFavorited}/>
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
               {
                file.type === "image" &&
                    <img 
                        alt={file.name}
                        width="200"
                        height="100"
                        src={getFileUrl(file.fileId)}
                    />
               }

               {file.type === "csv" && <GanttChartIcon width={20} height={20} />}
               {file.type === "pdf" && <FileTextIcon  width={20} height={20}/>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2 text-[14px] text-gray-800 font-semibold w-40 items-center">
                    <Avatar className="w-6 h-6 text-[12px]">
                        <AvatarImage src={ userProfile?.image } alt="user image" />
                        <AvatarFallback>WZ</AvatarFallback>
                    </Avatar>
                    { userProfile?.name }
                </div>
                <div className="text-xs text-gray-800 font-semibold">
                    Uploaded {formatRelative((new Date(file._creationTime)), new Date())}
                </div>

            </CardFooter>
        </Card>
    )
}