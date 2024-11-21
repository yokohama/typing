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
          p-2 sm:p-6 lg:p-8
          flex justify-between items-center 
      ">
        <Link key="top" 
          href={session ? "/shuting" : "/" }
          className="
            text-2xl sm:text-3xl lg:text-4xl
            text-yellow-600
            font-bold
            tracking-wide
        ">
          <p className="hover:text-gray-700">ゆっくりタイピング</p>
          <p className="
            text-xs lg:text-sm xl:text-sm
            text-gray-700
          ">
            Learn and improve your typing skills
          </p>
        </Link>
        <Login />
      </div>
    </header>
  );
}
