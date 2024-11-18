import Link from "next/link"

export function SubHeader({ 
  title,
  children
}: {
  title: String,
  children?: React.ReactNode
}) {
  return (
    <header
      className="
        w-full bg-red-200 shadow py-4 px-6 mb-8
        flex justify-between items-center rounded-t-xl
    ">
      <h2 
        className="
          text-2xl font-semibold text-gray-800
      ">{title}</h2>
      {children}
    </header>
  )
}

export function SubHeaderButton({
  title,
  url,
} : {
  title: string,
  url: string,
}) {
  return (
    <Link href={url}>
      <button
        className="
          px-4 py-2 
          bg-green-500 text-white font-semibold
          rounded
          hover:bg-green-600
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
      ">{title}</button>
    </Link>
  )
}
