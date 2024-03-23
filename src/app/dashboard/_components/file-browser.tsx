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
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@radix-ui/react-label";

export default function FileBrowser({ title, filterFavourites, deletedOnly }: { title: string, filterFavourites?: boolean, deletedOnly?: boolean}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

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
    orgId 
      ? { 
        orgId, 
        query, 
        type: type === 'all' ? undefined : type, 
        favourites:filterFavourites, 
        deletedOnly 
      } 
      : "skip"
  );
  
  const isLoading = files === undefined;

  const modifiedFiles = 
    files?.map((file) => ({
      ...file,
      isFavorited: (favourites ?? []).some(
        (favourite) => favourite.fileId === file._id
      ),
  })) ?? [];

  return (
    <div>
        <>
          <div className="flex justify-between mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <UploadButton />
          </div>
          <SearchBar query={query} setQuery={setQuery}/>

          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center">
              <TabsList className="mb-4">
                <TabsTrigger value="grid" className="flex gap-2 items-center"><GridIcon /> Grid</TabsTrigger>
                <TabsTrigger value="table" className="flex gap-2 items-center"><RowsIcon />Table</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 items-center font-semibold">
                <Label htmlFor="type-selector" className="text-gray-800">Filter by type:</Label>
                <Select value={type} onValueChange={
                  (newType) => {
                    setType(newType as any);
                  }
                }>
                  <SelectTrigger id="type-selector" className="w-[180px]" defaultValue={"all"}>
                    <SelectValue placeholder="All"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
      
            </div>

            {isLoading && 
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                <Loader2 className="w-32 h-32 animate-spin text-gray-500" />
                <p className="text-2xl text-gray-500"> Loading your files ...</p>
              </div>
            }

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modifiedFiles?.map((file) => {
                    return <FileCard key={file._id} file={file} />;
                  })}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {files?.length === 0 && ( <Placeholder filterFavourites /> )}
        </>
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
            You have not selected any favourites yet.
          </div>
        </div>
      )}
     
    </div> 
  )
}