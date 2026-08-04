import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import FluidCursor from "@/components/FluidCursor";
import MusicToggle from "@/components/MusicToggle";

const font = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "FEDO LAB",
  description: "Empowering Your Business with Cutting Edge Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <Navbar />
        {/* <FluidCursor /> */}
        {children}
        <Footer />
        <MusicToggle />
      </body>
    </html>
  );
}
