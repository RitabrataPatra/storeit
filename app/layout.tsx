import type { Metadata } from "next";
import { Poppins } from "next/font/google";


import "./globals.css";
import AlertComp from "@/components/AlertComp";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "StoreIt - You Store It Here",
  description: "An app where you can store your files and everything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <AlertComp/>
        {children}
      </body>
    </html>
  );
}
