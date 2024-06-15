import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/context/toaster-context";
import PusherGlobalClient from "@/components/pusher-global-client";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KiChat",
  description: "Website chat dengan fitur menarik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ToasterContext />
        <SessionProvider>
          <PusherGlobalClient />
        </SessionProvider>
        {children}
      </body>
    </html>
  );
}
