"use client";

import Link from 'next/link';

export default function Page() {
  return(
    <>
      <div>
        <Link href={`/shuting/1`} key="1">
          <div
            className="bg-red-50 mb-4 p-2 h-16 rounded hover:bg-red-100 transition-all duration-200 ease-in-out">
            <p>Level1</p>
          </div>
        </Link>
        <Link href={`/shuting/2`} key="2">
          <div
            className="bg-red-50 mb-4 p-2 h-16 rounded hover:bg-red-100 transition-all duration-200 ease-in-out">
            <p>Level2</p>
          </div>
        </Link>
      </div>
    </>
  );
}
