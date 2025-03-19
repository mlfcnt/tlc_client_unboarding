"use client";

import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "./components/Header";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner";
import {esMX} from "@clerk/localizations";
import Head from "next/head";

export default function RootLayout({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider afterSignOutUrl="/" localization={esMX}>
        <html lang="es">
          <Head>
            <title>TLC Onboarding - Dashboard</title>
            <meta name="description" content="TLC Onboarding - Dashboard" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <head />
          <body className="bg-gray-100">
            <Header />
            <main className="pt-8">{children}</main>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
