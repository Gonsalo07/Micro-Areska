import { Separator } from '@/components/ui/separator'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Esto es cómo los demás te verán en el sitio.
        </p>
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground">Formulario de perfil próximamente...</div>
    </div>
  )
}
