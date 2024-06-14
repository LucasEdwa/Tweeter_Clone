import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]/route";
import QueryProvider from "@/components/QueryProvider"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twetter",
  description: "sweet tweet wee",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session =await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <QueryProvider>
          {children}
          </QueryProvider>
        </SessionProvider>
        </body>
    </html>
  );
}
