"use client";

import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "./dashboard/files/uploadButton";
import { FileCard } from "./file-card";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "./dashboard/files/search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">

      <div className="flex gap-8">
        <div className="w-40 flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant={"link"} className="flex gap-2">
              <FileIcon /> All Files
            </Button>
          </Link>

          <Link href="/dashboard/favourites">
            <Button variant={"link"} className="flex gap-2">
              <StarIcon /> Favourites
            </Button>
          </Link>
        </div>

        <div className="w-full">
          {isLoading && 
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              <Loader2 className="w-32 h-32 animate-spin text-gray-500" />
              <p className="text-2xl text-gray-500"> Loading your images ...</p>
            </div>
          }


          {!isLoading && (
            <>
              <div className="flex justify-between mb-8">
                <h1 className="text-4xl font-bold">Your Files</h1>
                <UploadButton />
              </div>
              <SearchBar query={query} setQuery={setQuery}/>

              {files.length === 0 && (
                <Placeholder />
              )}
            </>
            )
          }
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files?.map((file) => {
                return <FileCard key={file._id} file={file}/>
              })}
          </div>
        </div>
      </div>
    </main>
  );
}

function Placeholder() {
  return(
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
  )
}