import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloudly",
  description: "Cloudly is a file drive service that allows you to store and share files with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <ConvexClientProvider>
          <Toaster />
          {children} 
        </ConvexClientProvider>
      </body>
    </html>
  );
}