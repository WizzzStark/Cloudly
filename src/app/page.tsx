"use client";

import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "./uploadButton";
import { FileCard } from "./file-card";
import Image from "next/image";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-12">

      {files && files?.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image 
            alt="an image of files in a folder"
            width="400"
            height="400"
            src="/empty.svg"
            />
            <div className="text-2xl">
              You dont have any files yet. Upload some to get started.
            </div>
            <UploadButton />
        </div> 
      )}

      {
        files && files?.length > 0 && (
         <>
          <div className="flex justify-between mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>
         </>
        )
      }
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
            return <FileCard key={file._id} file={file}/>
          })}
      </div>
    </main>
  );
}