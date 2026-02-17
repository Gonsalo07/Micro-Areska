import { Separator } from '@/components/ui/separator'

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notificaciones</h3>
        <p className="text-sm text-muted-foreground">Configura cómo recibes notificaciones.</p>
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground">
        Formulario de notificaciones próximamente...
      </div>
    </div>
  )
}
