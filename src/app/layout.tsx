import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karan Engineers & Fabrication, Nashik",
  description: "Karan Engineers & Fabrication, Nashik — job work, machined components, turning, milling & CNC. GST 27AVRPK3981G1Z1. View catalogue on IndiaMART.",
  openGraph: {
    title: "Karan Engineers & Fabrication — Job Work & Machined Components, Nashik",
    description: "Job work, machined components & turning machine job — service provider from Nashik, Maharashtra, India.",
    images: ["https://5.imimg.com/data5/AL/TH/UV/NSDMERP-20762121/20762121-product-1541063333096-500x500.jpg"],
    url: "https://www.indiamart.com/dinesh-eng/",
  },
  twitter: {
    card: "summary_large_image",
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
