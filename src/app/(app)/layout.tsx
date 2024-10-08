
import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hide MyWord",
  description: "Anonymous messages sharing web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <>
     
       <Navbar/>
        {children}
  
        </>
    
  );
}
