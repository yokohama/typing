"use client";

import Link from 'next/link';

export default function Page() {
  return(
    <>
      <div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
          <Link href={`/shuting/1`} key="1">
            <div className="bg-white shadow-md rounded-lg flex items-center h-32 transition-transform transform hover:scale-105 hover:bg-gray-100">
              <img
                src="/images/level1.png"
                alt="Level1 illustration"
                className="h-full w-auto object-cover mr-4 rounded-tl-lg rounded-bl-lg"
              />
              <div>
                <h3 className="text-3xl font-bold">Level1</h3>
                <p className="text-lg text-gray-500">
                  初心者向けのチャレンジ！
                </p>
              </div>
            </div>
          </Link>

          <Link href={`/shuting/2`} key="2">
            <div className="bg-white shadow-md rounded-lg flex items-center h-32 transition-transform transform hover:scale-105 hover:bg-gray-100">
              <img
                src="/images/level2.png"
                alt="Level2 illustration"
                className="h-full w-auto object-cover mr-4 rounded-tl-lg rounded-bl-lg"
              />
              <div>
                <h3 className="text-3xl font-bold">Level2</h3>
                <p className="text-lg text-gray-500">
                  初心者向けのチャレンジ！
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
