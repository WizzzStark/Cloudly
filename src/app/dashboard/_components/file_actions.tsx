    
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
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
} from "@/components/ui/alert-dialog"

import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Download, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Protect } from "@clerk/nextjs"
    

export function getFileUrl(fileId: Id<"_storage">): string {
    const getImageUrl = new URL(`https://youthful-frog-508.convex.site/getImage`)
    getImageUrl.searchParams.set("storageId", fileId);
    return getImageUrl.toString();
}

export function FileCardActions({ file, isFavourite }: { file: Doc<"files">, isFavourite: boolean}){
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavourite = useMutation(api.files.toggleFavourite);
    const [isConfirmOpem, setIsConfirmOpen] = useState(false);
    const {toast} = useToast();
    const me = useQuery(api.users.getMe);


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
                        })

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
                    condition={ (check) => {
                        return check({
                            role: "org:admin",
                        }) || file.userId === me?._id;
                    }}
                    fallback={<></>}
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