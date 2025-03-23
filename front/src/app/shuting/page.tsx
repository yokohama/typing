"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Shuting } from '@/types/shuting';
import { useShutings } from '@/hooks/useShutings';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings`;
  const [shutings, setShutings] = useState<Shuting[]>([]);

  useShutings(endpoint, setShutings);

  return(
    <div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
        {shutings.map((shuting) => (
          <ShutingItem
            key={shuting.id}
            shuting_id={shuting.id}
            level={shuting.level}
            description={shuting.description}
          />
        ))}
      </div>
    </div>
  );
}

const ShutingItem = ({
  shuting_id,
  level,
  description,
} : {
  shuting_id: number,
  level: number,
  description: string,
}) => {
  return (
    <Link href={`/shuting/${shuting_id}`} key="1">
      <div
        className="
          h-32
          bg-orange-50
          flex items-center
          transition-transform transform
          bg-white shadow-md rounded-lg
          text-gray-500
          hover:scale-105
          hover:bg-orange-100
          hover:text-black
          hover:border-4
          hover:border-orange-300
          hover:rounded-xl
      ">
        <img
          src={`/images/level${level}.png`}
          alt={`level${level}`}
          className="
            rounded-tl-lg rounded-bl-lg
            h-full w-auto object-cover
          "/>

        <div className="p-2 sm:p-4 lg:p-6">
          <h3 className="text-3xl font-bold">
          {`レベル${level}`}
          </h3>
          <p className="
            text-md lg:text-lg
            text-gray-500
          ">{description}</p>
        </div>
      </div>
    </Link>
  )
};
