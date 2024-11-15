"use client";

import React from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';

import Login from "@/components/Login";

export default function Header() {
  const { data: session } = useSession();

  return(
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6 lg:p-8">
        <Link key="top" 
          href="/"
          className="text-xl font-semibold text-gray-800 hover:text-gray-600">
          TOP
        </Link>
        <nav className="flex space-x-4">
          {session && (
            <>
              <Link key="shuting" 
                href="/shuting"
                className="text-gray-700 hover:text-gray-500"
              >
                Shuting
              </Link>
              <Link key="account" 
                href="/account"
                className="text-gray-700 hover:text-gray-500"
              >
                Account
              </Link>
            </>
          )}
        </nav>
        <Login />
      </div>
    </header>
  );
}
