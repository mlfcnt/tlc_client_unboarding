"use client";

import {ClerkProvider} from "@clerk/nextjs";
import Header from "./components/Header";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner";
import {esMX} from "@clerk/localizations";

export const ClientLayout = ({children}: {children: React.ReactNode}) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider afterSignOutUrl="/" localization={esMX}>
        <Header />
        <main className="pt-8">{children}</main>
        <Toaster position="top-right" />
      </ClerkProvider>
    </QueryClientProvider>
  );
};
