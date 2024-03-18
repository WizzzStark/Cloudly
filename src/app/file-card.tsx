import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { DeleteIcon, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"


function getFileUrl(fileId: Id<"_storage">): string {
    const getImageUrl = new URL(`https://youthful-frog-508.convex.site/getImage`)
    getImageUrl.searchParams.set("storageId", fileId);
    return getImageUrl.toString();
}

function FileCardActions({ file }: { file: Doc<"files">}){
    const deleteFile = useMutation(api.files.deleteFile);
    const [isConfirmOpem, setIsConfirmOpen] = useState(false);
    const {toast} = useToast();
    return ( 
        <>
        <AlertDialog open={isConfirmOpem} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={async () => {
                        await deleteFile({
                            fileId: file._id,
                        });

                        toast({
                            variant: "default",
                            title: "File deleted",
                            description: "Your file is now gone from our servers.",
                          });
                }}
                >
                    Continue
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
            <DropdownMenuTrigger> <MoreVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem 
                    className="flex gap-1 text-red-600 items-center cursor-pointer"
                    onClick={() => setIsConfirmOpen(true)}
                    >
                    <TrashIcon size={16} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}

export function FileCard({ file }: { file: Doc<"files">}){

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      } as Record<Doc<"files">["type"], ReactNode>;


    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <p className="text-center flex justify-center">{typeIcons[file.type]}</p>
                    {file.name} 
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file}/>
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
            <CardFooter className="flex justify-center">
                <Button onClick={() => {
                    window.open(getFileUrl(file.fileId));
                }}>Download</Button>
            </CardFooter>
        </Card>
    )
}