"use client";

import "./globals.css";

import { SessionProvider } from 'next-auth/react';

import { UserProvider } from '@/context/UserContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="trusted-types nextjs#bundler;" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <SessionProvider>
          <UserProvider>
            <Header />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
