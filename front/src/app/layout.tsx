"use client";

import { Noto_Sans_JP, Inter } from 'next/font/google';
import "./globals.css";

import { SessionProvider } from 'next-auth/react';

import { ConfigProvider } from '@/context/ConfigContext';
import { AlertProvider } from '@/context/AlertContext';
import { UserProvider } from '@/context/UserContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert } from '@/components/Alert';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ja" className={`${notoSansJP.className} ${inter.className}`}>
      <head>
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="trusted-types nextjs#bundler;" />
      </head>
      <body className="bg-yellow-50 text-gray-900">
        <ConfigProvider>
          <AlertProvider>
            <SessionProvider>
              <UserProvider>
                <Header />
                <main className="
                  max-w-7xl mx-auto p-4 sm:p-6 lg:p-8
                ">
                  <Alert />
                  {children}
                </main>
                <Footer />
              </UserProvider>
            </SessionProvider>
          </AlertProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
