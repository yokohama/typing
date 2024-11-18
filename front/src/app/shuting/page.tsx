"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { Shuting } from '@/types/shuting';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings`;

  const [shutings, setShutings] = useState<Shuting[]>([]);

  useEffect(() => {
    const fetchShutingsData = async () => {
      const data = await fetchData<Shuting[] | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching shutings data:', data.message);
        return;
      }

      setShutings(data);
    };

    fetchShutingsData();
  }, []);

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
  description
} : {
  shuting_id: number,
  level: number,
  description: string
}) => {
  return (
    <Link href={`/shuting/${shuting_id}`} key="1">
      <div 
        className="
          h-32
          flex items-center
          transition-transform transform
          bg-white shadow-md rounded-lg
          text-gray-500
          hover:scale-105
          hover:bg-red-100
          hover:text-black
	  hover:border-4
	  hover:border-red-300
      ">
        <img
          src={`/images/level${level}.png`}
          alt={`level${level}`}
          className="
            mr-4
            rounded-tl-lg rounded-bl-lg
            h-full w-auto object-cover
          "/>

        <div>
          <h3 className="text-3xl font-bold">
          {`レベル${level}`}
          </h3>
          <p className="text-lg text-gray-500">
          {description}
          </p>
        </div>
      </div>
    </Link>
  )
};
