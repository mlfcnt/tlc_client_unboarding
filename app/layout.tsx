import "./globals.css";
import {Metadata} from "next";
import {ClientLayout} from "./ClientLayout";

export const metadata: Metadata = {
  title: "TLC Onboarding",
  description: "TLC Onboarding - Dashboard",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
