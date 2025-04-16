import Link from "next/link";

export function SubHeader({ 
  title,
  href,
  children
}: {
  title: string,
  href?: string,
  children?: React.ReactNode
}) {
  return (
    <header
      className="
        w-full
        px-2 lg:px-4
        py-2 lg:py-6
        mb-4
        bg-red-200 shadow
        flex justify-between items-center rounded-t-xl
    ">
      {href ? (
        <Link href={href}>
          <h2 
            className="
              text-xl lg:text-2xl
              font-bold text-gray-600
              hover:text-pink-600
          ">{title}</h2>
        </Link>
      ) : (
        <h2 
          className="
            text-xl lg:text-2xl
            font-bold text-gray-600
        ">{title}</h2>
      )}
      {children}
    </header>
  )
}
