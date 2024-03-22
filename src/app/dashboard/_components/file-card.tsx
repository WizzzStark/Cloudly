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

import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Protect } from "@clerk/nextjs"


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
                    Your file will be moved to the Trash, we permanently remove the files every 12h.
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
    

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
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
            <CardFooter className="flex justify-center">
                <Button onClick={() => {
                    window.open(getFileUrl(file.fileId));
                }}>Download</Button>
            </CardFooter>
        </Card>
    )
}