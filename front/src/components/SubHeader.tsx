export function SubHeader({ 
  title,
  children
}: {
  title: string,
  children?: React.ReactNode
}) {
  return (
    <header
      className="
        w-full
        px-2 lg:px-4
        py-2 lg:py-6
        mb-8
        bg-red-200 shadow
        flex justify-between items-center rounded-t-xl
    ">
      <h2 
        className="
          text-xl lg:text-2xl
          font-bold text-gray-600
      ">{title}</h2>
      {children}
    </header>
  )
}
