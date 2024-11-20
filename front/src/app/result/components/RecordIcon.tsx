import Link from "next/link";

import { FaListUl } from "react-icons/fa";

export const RecordIcon = () => {
  return (
    <Link href="/result">
      <button
        className="
          bg-pink-500 
          hover:bg-pink-600 
          text-white 
          rounded-full 
          w-10 h-10 
          flex 
          justify-center 
          items-center 
          shadow-md
      ">
        <FaListUl size={16} />
      </button>
    </Link>
  );
}
