"use client";

import { Button } from "@/components/ui/button";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  file: z
        .custom<FileList | null>((value) => value instanceof FileList, "Required")
        .refine((files) => files !== null && files.length > 0, `Required`),
})

export default function Home() {
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
    const postUrl = await generateUploadUrl();

    if(values.file === null) return;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    if (!orgId) return;

    try{
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
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
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="container mx-auto pt-12">

      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Your Files</h1>

        <Dialog open={isFileUploadOpen} onOpenChange={(isOpen) => {
          setIsFileUploadOpen(isOpen);
          form.reset();
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                
              }}
            >
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-8">Upload your File</DialogTitle>
              <DialogDescription>
                <DialogDescription className="mb-4">
                  The uploaded file will be visible to all members of your organization.
                </DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                      {form.formState.isSubmitting &&
                        <Loader2 className="w-6 h-6 animate-spin" />
                      }
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
     
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}