import { Separator } from '@/components/ui/separator'

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Apariencia</h3>
        <p className="text-sm text-muted-foreground">Personaliza la apariencia de la aplicación.</p>
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground">Formulario de apariencia próximamente...</div>
    </div>
  )
}
