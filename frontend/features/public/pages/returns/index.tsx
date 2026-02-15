export function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Política de devoluciones</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Queremos que estés completamente satisfecho con tu compra. Si no estás contento con tu
          pedido, estamos aquí para ayudarte con nuestra política de devoluciones sin
          complicaciones.
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Resumen de política de devoluciones</h2>
          <div className="bg-card mb-6 rounded-lg border p-6">
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              <div>
                <div className="text-primary mb-2 text-3xl font-bold">30</div>
                <div className="text-muted-foreground text-sm">Días para devolver</div>
              </div>
              <div>
                <div className="text-primary mb-2 text-3xl font-bold">GRATIS</div>
                <div className="text-muted-foreground text-sm">Envío de devolución</div>
              </div>
              <div>
                <div className="text-primary mb-2 text-3xl font-bold">100%</div>
                <div className="text-muted-foreground text-sm">Garantía de reembolso</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Qué se puede devolver</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 text-lg font-semibold text-green-800">
                  ✓ Artículos retornables
                </h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Artículos en condición original</li>
                  <li>• Productos sin usar con etiquetas</li>
                  <li>• Artículos en embalaje original</li>
                  <li>• Electrónicos con todos los accesorios</li>
                  <li>• Ropa y accesorios</li>
                </ul>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-3 text-lg font-semibold text-red-800">
                  ✗ Artículos no retornables
                </h3>
                <ul className="space-y-2 text-red-700">
                  <li>• Artículos personalizados o a medida</li>
                  <li>• Productos perecederos</li>
                  <li>• Artículos íntimos o sanitarios</li>
                  <li>• Artículos dañados por mal uso</li>
                  <li>• Descargas digitales</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Cómo devolver un artículo</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="text-center">
                  <div className="bg-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-primary-foreground">
                    {step}
                  </div>
                  <h3 className="mb-2 font-semibold">
                    {
                      [
                        'Iniciar devolución',
                        'Imprimir etiqueta',
                        'Empacar y enviar',
                        'Recibir reembolso',
                      ][step - 1]
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        'Inicia sesión en tu cuenta y selecciona el artículo que deseas devolver',
                        'Imprime la etiqueta de envío de devolución prepagada que proporcionamos',
                        'Empaca el artículo de forma segura y déjalo en cualquier punto de envío',
                        'Recibe tu reembolso dentro de 5-7 días hábiles después de que recibamos tu devolución',
                      ][step - 1]
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Plazos de devolución</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Tipo de Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Plazo de Devolución
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Procesamiento de Reembolso
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Artículos Estándar', '30 días', '5-7 días hábiles'],
                  ['Electrónicos', '30 días', '7-10 días hábiles'],
                  ['Artículos en Oferta', '14 días', '5-7 días hábiles'],
                ].map(([type, window, time]) => (
                  <tr key={type}>
                    <td className="px-6 py-4 text-sm font-medium">{type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{window}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Intercambios</h2>
          <div className="space-y-4">
            <p>
              Actualmente no ofrecemos intercambios directos. Si necesitas un tamaño, color o modelo
              diferente, por favor devuelve tu artículo original y realiza un nuevo pedido del
              artículo que deseas.
            </p>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">💡 Consejo</h3>
              <p className="text-blue-700">
                Para asegurarte de obtener el artículo que deseas rápidamente, realiza tu nuevo
                pedido primero, luego devuelve el artículo original. De esta manera, no tendrás que
                esperar a que se procese la devolución.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Devoluciones internacionales</h2>
          <div className="space-y-4">
            <p>
              Los clientes internacionales pueden devolver artículos dentro de los 30 días de
              entrega. Ten en cuenta:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Los costos de envío de devolución son responsabilidad del cliente</li>
              <li>Los artículos deben devolverse a nuestro almacén en EE. UU.</li>
              <li>Los aranceles aduaneros e impuestos no son reembolsables</li>
              <li>El procesamiento puede tardar 10-14 días hábiles debido al despacho aduanero</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Artículos dañados o defectuosos</h2>
          <div className="space-y-4">
            <p>
              Si recibes un artículo dañado o defectuoso, contáctanos inmediatamente. Te
              proporcionaremos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Envío de devolución gratuito</li>
              <li>Reembolso completo o reemplazo</li>
              <li>Procesamiento acelerado</li>
              <li>Compensación adicional si corresponde</li>
            </ul>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-yellow-800">
                <strong>Importante:</strong> Por favor toma fotos de los artículos dañados y el
                embalaje antes de devolverlos. Esto nos ayuda a mejorar nuestros procesos de
                embalaje y envío.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">¿Necesitas ayuda?</h2>
          <div className="space-y-4">
            <p>
              Nuestro equipo de servicio al cliente está aquí para ayudarte con cualquier pregunta
              sobre devoluciones:
            </p>
            <div className="rounded-lg bg-card border p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Información de contacto</h3>
                  <p>
                    <strong>Email:</strong> returns@store.com
                  </p>
                  <p>
                    <strong>Teléfono:</strong> 1-800-STORE-01
                  </p>
                  <p>
                    <strong>Horario:</strong> Lun-Vie 9AM-6PM EST
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Dirección de devoluciones</h3>
                  <p>
                    Departamento de devoluciones de tienda
                    <br />
                    123 Commerce Street
                    <br />
                    Business City, BC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
