import type { Metadata } from "next";
import "./globals.css";
import { COMPANY } from "@/src/constants";

export const metadata: Metadata = {
  title: COMPANY.siteFullName,
  description:
    "Karan Engineers & Fabrication, Nashik — job work, machined components, turning, milling & CNC. GST 27AVRPK3981G1Z1. View catalogue on IndiaMART.",
  metadataBase: new URL("https://cncmachiningnashik.com"),
  openGraph: {
    title: "Karan Engineers & Fabrication — Job Work & Machined Components, Nashik",
    description:
      "Job work, machined components & turning machine job — service provider from Nashik, Maharashtra, India.",
    images: [
      {
        url: "https://cncmachiningnashik.com/logo.png",
        width: 512,
        height: 512,
        alt: COMPANY.siteFullName,
      },
    ],
    url: "https://cncmachiningnashik.com/",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cncmachiningnashik.com/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
