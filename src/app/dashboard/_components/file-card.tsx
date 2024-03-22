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

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Download, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Protect } from "@clerk/nextjs"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'


function getFileUrl(fileId: Id<"_storage">): string {
    const getImageUrl = new URL(`https://youthful-frog-508.convex.site/getImage`)
    getImageUrl.searchParams.set("storageId", fileId);
    return getImageUrl.toString();
}

function FileCardActions({ file, isFavourite }: { file: Doc<"files">, isFavourite: boolean}){
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavourite = useMutation(api.files.toggleFavourite);
    const [isConfirmOpem, setIsConfirmOpen] = useState(false);
    const {toast} = useToast();


    return ( 
        <>
        <AlertDialog open={isConfirmOpem} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    Your file will be moved to the Trash and will be permanently deleted soon.
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
                            description: "Your file is now in the trash marked for deletion.",
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
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => window.open(getFileUrl(file.fileId))}
                    >
                    <div className="flex gap-1 items-center">
                        <Download size={16}/>
                        Download
                    </div>
                
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => toggleFavourite({fileId: file._id})}
                    >
                    {isFavourite ? (
                        <div className="flex gap-1 items-center">
                            <StarIcon fill="#000000" size={16}/>
                            Unfavourite
                        </div>
                    ) : (
                        <div className="flex gap-1 items-center">
                            <StarIcon size={16}/>
                            Favourite
                        </div>
                    )}
                
                </DropdownMenuItem>
                <Protect
                    role="org:admin"
                    fallback={
                      <></>
                    }
                >
                <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="flex gap-1 text-red-600 items-center cursor-pointer"
                        onClick={() => {
                            if (file.shouldDelete){
                                restoreFile({
                                    fileId: file._id,
                                });
                            }else{
                                setIsConfirmOpen(true)
                            }   
                        }}
                        >
                            {file.shouldDelete ? 
                            <div className="flex gap-1 text-green-500 items-center cursor-pointer">
                                <UndoIcon size={16} />Restore
                            </div> : 
                            <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                                <TrashIcon size={16} /> Delete
                            </div>}
                    </DropdownMenuItem>
                </Protect>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}

export function FileCard({ file, favourites }: { file: Doc<"files">, favourites: Doc<"favourites">[]}){

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      } as Record<Doc<"files">["type"], ReactNode>;

    
    const isFavourite = favourites?.some((favourite) => favourite.fileId === file._id);

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
                    <FileCardActions file={file} isFavourite={isFavourite}/>
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