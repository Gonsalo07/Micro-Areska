import type { Metadata } from 'next'

import { ContactPage } from '@public/pages/contact'

export const metadata: Metadata = {
  title: 'Formulario de contacto',
}
export default function Page() {
  return <ContactPage />
}
