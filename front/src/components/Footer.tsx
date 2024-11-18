import Link from "next/link";

export default function Footer() {
  return(
    <footer 
      className="
        py-4
	bg-yellow-300
        text-center 
        border-t 
        border-gray-200
    ">
      <p className="text-sm text-gray-500">
        <Link href="/">&copy; typing</Link>
      </p>
    </footer>
  );
}
