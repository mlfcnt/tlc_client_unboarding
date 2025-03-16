"use client";

import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "./components/Header";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/toaster";

export default function RootLayout({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider afterSignOutUrl="/">
        <html lang="es">
          <body className="bg-bg">
            <Header />
            <main className="pt-8">{children}</main>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
