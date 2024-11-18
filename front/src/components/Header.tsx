"use client";

import React from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';

import Login from "@/components/Login";

export default function Header() {
  const { data: session } = useSession();

  return(
    <header className="bg-yellow-400 shadow-md">
      <div 
        className="
          p-4 sm:p-6 lg:p-8
          flex justify-between items-center 
      ">
        <Link key="top" 
          href={session ? "/shuting" : "/" }
          className="text-xl font-semibold text-gray-800 hover:text-gray-600">
          TYPING
        </Link>

        <Login />
      </div>
    </header>
  );
}
