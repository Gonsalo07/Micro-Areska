import { ReactNode } from 'react'

import { Footer } from '@public/components/layout/footer'
import { Navbar } from '@public/components/layout/navbar'

interface Props {
  children: ReactNode
}

export function PublicLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
