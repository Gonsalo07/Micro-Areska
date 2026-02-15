export function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Términos del servicio</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Aceptación de términos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Al acceder y usar este sitio web, aceptas y estás de acuerdo en cumplir con los
              términos y disposiciones de este acuerdo. Si no estás de acuerdo con lo anterior, por
              favor no uses este servicio.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Licencia de uso</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Se otorga permiso para descargar temporalmente una copia de los materiales del sitio
              web de la Tienda solo para visualización personal y no comercial. Esta es la concesión
              de una licencia, no una transferencia de título, y bajo esta licencia no puedes:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Modificar o copiar los materiales</li>
              <li>
                Usar los materiales para cualquier propósito comercial o para exhibición pública
              </li>
              <li>
                Intentar realizar ingeniería inversa de cualquier software contenido en el sitio web
              </li>
              <li>
                Eliminar cualquier nota de derechos de autor u otras notaciones de propiedad de los
                materiales
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. Información del producto</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Nos esforzamos por proporcionar información precisa del producto, incluyendo
              descripciones, precios y disponibilidad. Sin embargo:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Los colores del producto pueden variar debido a la configuración del monitor</li>
              <li>
                Nos reservamos el derecho de corregir cualquier error en precios o información del
                producto
              </li>
              <li>La disponibilidad del producto está sujeta a cambios sin previo aviso</li>
              <li>Podemos limitar las cantidades disponibles para compra</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Pedidos y pago</h2>
          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-xl font-medium">Aceptación de pedidos</h3>
            <p>
              Todos los pedidos están sujetos a nuestra aceptación. Nos reservamos el derecho de
              rechazar o cancelar cualquier pedido por cualquier motivo, incluyendo pero no limitado
              a disponibilidad del producto, errores en información del producto o precios, o
              actividad fraudulenta sospechosa.
            </p>

            <h3 className="mt-6 text-xl font-medium">Términos de pago</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>El pago vence al momento del pedido</li>
              <li>Aceptamos las principales tarjetas de crédito y PayPal</li>
              <li>Todos los precios están en USD a menos que se especifique lo contrario</li>
              <li>Eres responsable de cualquier impuesto aplicable</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Envío y entrega</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Los tiempos y costos de envío varían según tu ubicación y el método de envío
              seleccionado. No somos responsables de retrasos causados por transportistas o
              procesamiento aduanero.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Envío estándar: 5-7 días hábiles</li>
              <li>Envío exprés: 2-3 días hábiles</li>
              <li>Envío nocturno: 1 día hábil</li>
              <li>Envío internacional: 7-21 días hábiles</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Devoluciones y reembolsos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Por favor consulta nuestra{' '}
              <a href="/devoluciones" className="text-primary hover:underline">
                Política de devoluciones
              </a>{' '}
              para información detallada sobre devoluciones, intercambios y reembolsos.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Cuentas de usuario</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Cuando creas una cuenta con nosotros, debes proporcionar información precisa y
              completa. Eres responsable de:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Mantener la confidencialidad de las credenciales de tu cuenta</li>
              <li>Todas las actividades que ocurran bajo tu cuenta</li>
              <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
              <li>Asegurar que la información de tu cuenta se mantenga actualizada</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Usos prohibidos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>No puedes usar nuestro servicio:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Para cualquier propósito ilegal o para solicitar a otros que realicen actos ilegales
              </li>
              <li>
                Para violar cualquier regulación, regla, ley internacional, federal, provincial o
                estatal, u ordenanza local
              </li>
              <li>
                Para infringir o violar nuestros derechos de propiedad intelectual o los derechos de
                propiedad intelectual de otros
              </li>
              <li>
                Para acosar, abusar, insultar, dañar, difamar, calumniar, menospreciar, intimidar o
                discriminar
              </li>
              <li>Para enviar información falsa o engañosa</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">9. Limitación de responsabilidad</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              En ningún caso la Tienda o sus proveedores serán responsables de ningún daño
              (incluyendo, sin limitación, daños por pérdida de datos o ganancias, o debido a
              interrupción del negocio) que surja del uso o la incapacidad de usar los materiales
              del sitio web de la Tienda, incluso si la Tienda o un representante autorizado de la
              Tienda ha sido notificado oralmente o por escrito de la posibilidad de tal daño.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">10. Ley aplicable</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de [Tu
              Estado/País] y te sometes irrevocablemente a la jurisdicción exclusiva de los
              tribunales en ese estado o ubicación.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">11. Cambios a los términos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Nos reservamos el derecho de revisar estos términos de servicio en cualquier momento
              sin previo aviso. Al usar este sitio web, aceptas estar sujeto a la versión actual de
              estos términos de servicio.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">12. Información de contacto</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Si tienes alguna pregunta sobre estos términos de servicio, contáctanos:</p>
            <div className="rounded-lg bg-card border p-6">
              <p>
                <strong>Email:</strong> legal@store.com
              </p>
              <p>
                <strong>Teléfono:</strong> 1-800-STORE-01
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
