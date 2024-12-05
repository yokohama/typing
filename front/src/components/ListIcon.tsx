import Link from "next/link";

import { FaListUl } from "react-icons/fa";

export const ListIcon = ({
  href,
} : {
  href: string,
}) => {
  return (
    <Link href={href}>
      <button
        className="
          bg-pink-500 
          text-white 
          rounded-full 
          w-10 h-10 
          flex 
          justify-center 
          items-center 
          shadow-md
          hover:bg-pink-600 
          hover:scale-110
      ">
        <FaListUl size={16} />
      </button>
    </Link>
  );
}
