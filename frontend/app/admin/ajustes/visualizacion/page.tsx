import { Separator } from '@/components/ui/separator'

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visualización</h3>
        <p className="text-sm text-muted-foreground">
          Activa o desactiva elementos en la interfaz.
        </p>
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground">
        Formulario de visualización próximamente...
      </div>
    </div>
  )
}
