export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Política de privacidad</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Información que recopilamos</h2>
          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-xl font-medium">Información personal</h3>
            <p>
              Recopilamos información que nos proporcionas directamente, como cuando creas una
              cuenta, realizas una compra, te suscribes a nuestro boletín o nos contactas. Esto
              puede incluir:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Nombre e información de contacto (dirección de correo electrónico, número de
                teléfono, dirección postal)
              </li>
              <li>
                Información de pago (detalles de tarjeta de crédito, dirección de facturación)
              </li>
              <li>Credenciales de cuenta (nombre de usuario, contraseña)</li>
              <li>Historial de compras y preferencias</li>
              <li>Comunicaciones con nosotros</li>
            </ul>

            <h3 className="mt-6 text-xl font-medium">Información recopilada automáticamente</h3>
            <p>
              Cuando visitas nuestro sitio web, recopilamos automáticamente cierta información sobre
              tu dispositivo y uso, incluyendo:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Dirección IP e información de ubicación</li>
              <li>Tipo y versión del navegador</li>
              <li>Información del dispositivo</li>
              <li>Páginas visitadas y tiempo pasado en nuestro sitio</li>
              <li>Sitio web de referencia</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Cómo usamos tu información</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Usamos la información que recopilamos para:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Procesar y cumplir tus pedidos</li>
              <li>Proporcionar servicio y soporte al cliente</li>
              <li>Enviarte actualizaciones sobre tus pedidos y cuenta</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Personalizar tu experiencia de compra</li>
              <li>Enviar comunicaciones de marketing (con tu consentimiento)</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. Compartir información</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              No vendemos, intercambiamos ni alquilamos tu información personal a terceros. Podemos
              compartir tu información en las siguientes circunstancias:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Proveedores de servicios:</strong> Con proveedores de servicios externos de
                confianza que nos ayudan a operar nuestro negocio
              </li>
              <li>
                <strong>Requisitos legales:</strong> Cuando sea requerido por ley o para proteger
                nuestros derechos
              </li>
              <li>
                <strong>Transferencias comerciales:</strong> En relación con una fusión, adquisición
                o venta de activos
              </li>
              <li>
                <strong>Con tu consentimiento:</strong> Cuando aceptes explícitamente compartir tu
                información
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Seguridad de datos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tu información
              personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas
              medidas incluyen:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Cifrado SSL para transmisión de datos</li>
              <li>Procesamiento seguro de pagos</li>
              <li>Evaluaciones de seguridad regulares</li>
              <li>Controles de acceso y autenticación</li>
              <li>Capacitación de empleados en protección de datos</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Tus derechos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Tienes derecho a:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Acceder y actualizar tu información personal</li>
              <li>Solicitar la eliminación de tu información personal</li>
              <li>Cancelar la suscripción de comunicaciones de marketing</li>
              <li>Solicitar una copia de tus datos</li>
              <li>Oponerte al procesamiento de tu información personal</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctanos en{' '}
              <span className="font-medium">privacy@store.com</span> o usa la información de
              contacto proporcionada a continuación.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Cookies y seguimiento</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Usamos cookies y tecnologías de seguimiento similares para mejorar tu experiencia de
              navegación, analizar el tráfico del sitio y personalizar el contenido. Puedes
              controlar la configuración de cookies a través de las preferencias de tu navegador.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Cambios a esta política</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos de
              cualquier cambio importante publicando la nueva política en esta página y actualizando
              la fecha de &quot;Última actualización&quot;.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Contáctanos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Si tienes alguna pregunta sobre esta política de privacidad, contáctanos:</p>
            <div className="rounded-lg bg-card border p-6">
              <p>
                <strong>Email:</strong> areska@store.com
              </p>
              <p>
                <strong>Teléfono:</strong> 1-800-ARESK-01
              </p>
              <p>
                <strong>Dirección:</strong> 123 Commerce Street, Business City, BC 12345
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
