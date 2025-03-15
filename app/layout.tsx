import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "./components/Header";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <Header />
          <main className="pt-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
