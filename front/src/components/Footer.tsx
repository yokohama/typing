import Link from "next/link";

export default function Footer() {
  return(
    <footer className="text-center py-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        <Link href="/">&copy; typing</Link>
      </p>
    </footer>
  );
}
