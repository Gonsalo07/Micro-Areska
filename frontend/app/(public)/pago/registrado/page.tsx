import { Metadata } from 'next'

import { CheckoutSuccessPage } from '@public/pages/checkout/success'

export const metadata: Metadata = {
  title: 'Pago registrado',
}

export default function PagoRegistradoPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code ?? ''
  return <CheckoutSuccessPage code={code} />
}
