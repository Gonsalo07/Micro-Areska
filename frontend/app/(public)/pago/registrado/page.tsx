import { Metadata } from 'next'

import { CheckoutSuccessPage } from '@public/pages/checkout/success'

export const metadata: Metadata = {
  title: 'Pago registrado',
}

export default async function PagoRegistradoPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code = '' } = await searchParams
  return <CheckoutSuccessPage code={code} />
}
