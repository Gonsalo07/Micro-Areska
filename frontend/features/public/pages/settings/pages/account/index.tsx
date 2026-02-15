import { ContentSection } from '@public/pages/settings/components/content-section'

import { AccountForm } from './form'

export function SettingsAccountPage() {
  return (
    <ContentSection
      title="Cuenta"
      desc="Actualiza el correo electrónico y la contraseña de tu cuenta."
    >
      <AccountForm />
    </ContentSection>
  )
}
