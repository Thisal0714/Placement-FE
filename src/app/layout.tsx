import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/app/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Placement Test - Admin Backoffice + Customer Website",
  description: "Admin Backoffice + Customer Website for Placement Test",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              theme="light"
              className="toaster"
              toastOptions={{
                classNames: {
                  toast: "bg-background border-border text-foreground",
                  success: "bg-success text-white border-success",
                  error: "bg-danger text-white border-danger",
                  warning: "bg-warning text-foreground border-warning",
                  info: "bg-info text-white border-info",
                },
              }}
            />
          </QueryProvider>
        </body>
      </html>
    );
  }
  