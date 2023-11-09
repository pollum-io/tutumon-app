export default function Steps({
  order,
  title,
  children,
}: {
  order: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-y-12">
      <div className="flex flex-col items-start justify-center gap-y-4 text-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF7DA1] font-bold">
          {order}
        </div>
        <h3 className="whitespace-nowrap text-[2rem] font-bold text-white">
          {title}
        </h3>
        <div className="text-xl font-normal text-[#CCC]">{children}</div>
      </div>
    </div>
  )
}
