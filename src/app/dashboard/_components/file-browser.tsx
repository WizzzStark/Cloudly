"use client";

import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import UploadButton from "./uploadButton";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";

export default function FileBrowser({ title, filterFavourites }: { title: string, filterFavourites?: boolean}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favourites = useQuery(
    api.files.getAllFavourites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles, 
    orgId ? { orgId, query, favourites:filterFavourites } : "skip"
  );
  
  const isLoading = files === undefined;

  return (
    <div>
    
        {isLoading && 
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="w-32 h-32 animate-spin text-gray-500" />
            <p className="text-2xl text-gray-500"> Loading your images ...</p>
          </div>
        }


        {!isLoading && (
          <>
            <div className="flex justify-between mb-8">
              <h1 className="text-4xl font-bold">{title}</h1>
              <UploadButton />
            </div>
            <SearchBar query={query} setQuery={setQuery}/>

            {files.length === 0 && (
              <Placeholder filterFavourites />
            )}
          </>
          )
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files?.map((file) => {
              return <FileCard favourites={favourites ?? []}  key={file._id} file={file}/>
            })}
        </div>
      </div>

  );
}

function Placeholder({filterFavourites} : {filterFavourites?: boolean}) {
  return(
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      {!filterFavourites ? (
        <div>
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
      ) : (
        <div>
          <Image 
          alt="an image of files in a folder"
          width="600"
          height="600"
          src="/no_favourites.svg"
          />
          <div className="text-2xl font-semibold mt-10">
            You haven't selected any favourites yet.
          </div>
        </div>
      )}
     
    </div> 
  )
}