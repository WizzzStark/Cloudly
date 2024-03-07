'use client';

import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Home() {

  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <SignedIn>
          <SignOutButton>
            <Button> Log Out </Button>
          </SignOutButton> 
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button> Log In </Button>
          </SignInButton>
        </SignedOut>

        {files?.map((file) => (
          <div key={file._id}>
            {file.name}
          </div>
        ))}

        <Button onClick={() => createFile({ 
          name: "hello world"})}> Click me </Button>
    </main>
  );
}
