import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="size-full">
      <div className="flex p-5 gap-4 flex-col max-w-384 mx-auto h-full">{children}</div>
    </div>
  )
}
