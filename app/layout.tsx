import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/context/toaster-context";
import ActiveStatus from "@/components/active-status";

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
        <ActiveStatus />
        {children}
      </body>
    </html>
  );
}
