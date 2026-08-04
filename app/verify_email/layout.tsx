import type { Metadata } from "next";
import { Inter  } from "next/font/google";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html lang="en" className={`${inter.variable}`}>
      <body
        className={`antialiased bg-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
