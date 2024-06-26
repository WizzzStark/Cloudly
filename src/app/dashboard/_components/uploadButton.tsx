"use client";

import { Button } from "@/components/ui/button";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { fileTypes } from "../../../../convex/schema";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  file: z
        .custom<FileList | null>((value) => value instanceof FileList, "Required")
        .refine((files) => files !== null && files.length > 0, `Required`),
})

export default function UploadButton() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;
    if (values.file === null) return;

    const postUrl = await generateUploadUrl();

    const fileType = values.file[0]?.type;

    if (!fileType) return;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    const types = {
      "image/png": "image",
      "image/jpeg": "image",
      "image/gif": "image",
      "image/svg+xml": "image", 
      "image/webp": "image",
      "application/pdf": "pdf",
      "text/plain": "csv",
      "text/csv": "csv",
    } as Record<string, Doc<"files">["type"]>;

    try{
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: types[fileType],
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "File upload failed",
        description: "An error occurred while uploading your file. Please try again.",
      });
      return;
    }

    form.reset();
    toast({
      variant: "success",
      title: "File uploaded Successfully!",
      description: "Now your file is available to all members of your organization.",
    });
    setIsFileUploadOpen(false);
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const createFile = useMutation(api.files.createFile);

  return (

    <Dialog open={isFileUploadOpen} onOpenChange={(isOpen) => {
        setIsFileUploadOpen(isOpen);
        form.reset();
        }}>
        <DialogTrigger asChild>
        <Button 
          className="shimmer inline-flex h-10 items-center justify-center rounded-md 
                    border border-slate-800 bg-[linear-gradient(110deg,#0e122b,45%,#1e2631,55%,#0e122b)] 
                    bg-[length:200%_100%] px-[23px] font-medium text-slate-100 transition-colors focus:outline-none 
                    focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50"
        >
            Upload File
        </Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle className="mb-8 searchBarText">Upload your File</DialogTitle>
            <DialogDescription>
            <DialogDescription className="mb-4">
                The uploaded file will be visible to all members of your organization.
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                        <Input placeholder="Introduce the title of your file" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                    <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                        <Input 
                            type="file" {...fileRef} 
                            className=""
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                    {form.formState.isSubmitting &&
                    <Loader2 className="w-6 h-6 animate-spin searchBarText" />
                    }
                    Submit
                </Button>
                </form>
            </Form>
            </DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}