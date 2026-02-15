export function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Información de envíos</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Ofrecemos opciones de envío rápidas y confiables para que tu pedido llegue de manera
          segura.
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Opciones de envío</h2>
          <div className="text-muted-foreground">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Método de Envío
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Tiempo de Entrega
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Costo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Seguimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      Envío estándar
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      5-7 días hábiles
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      $5.99 (Gratis en compras +$100)
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      Sí
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      Envío exprés
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      2-3 días hábiles
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      $12.99
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      Sí
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      Envío nocturno
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      1 día hábil
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      $24.99
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      Sí
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      Internacional
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      7-21 días hábiles
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      Varía según ubicación
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
                      Sí
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Envío gratis</h2>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold">🚚 Envío estándar gratis</h3>
            <p className="mb-4 text-muted-foreground">
              Disfruta de envío estándar gratis en todos los pedidos superiores a $100. No se
              necesita código promocional - el descuento se aplica automáticamente al pagar.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Aplica al envío estándar dentro de Estados Unidos continental</li>
              <li>Los pedidos deben totalizar $100 o más antes de impuestos</li>
              <li>Excluye artículos de gran tamaño y requisitos de entrega especial</li>
              <li>No se puede combinar con otras promociones de envío</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Tiempo de procesamiento</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Todos los pedidos se procesan en 1-2 días hábiles. Los pedidos realizados después de
              las 2 PM EST se procesarán el siguiente día hábil.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Artículos en stock</h3>
                <p className="text-muted-foreground">Se envían en 1-2 días hábiles</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Artículos en pre-orden</h3>
                <p className="text-muted-foreground">Se envían en o antes de la fecha estimada</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Artículos personalizados</h3>
                <p className="text-muted-foreground">
                  El tiempo de procesamiento varía (3-10 días hábiles)
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Pedidos al por mayor</h3>
                <p className="text-muted-foreground">
                  Contáctanos para el cronograma de procesamiento
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Envíos internacionales</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Enviamos a más de 100 países en todo el mundo. Las tarifas y tiempos de entrega
              internacionales varían según el destino.
            </p>

            <h3 className="text-xl font-medium">Notas importantes:</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Los aranceles aduaneros e impuestos son responsabilidad del destinatario</li>
              <li>Los tiempos de entrega pueden extenderse debido al procesamiento aduanero</li>
              <li>Algunos productos pueden estar restringidos en ciertos países</li>
              <li>Los pedidos internacionales no se pueden acelerar</li>
            </ul>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">💡 Clientes internacionales</h3>
              <p className="text-muted-foreground">
                Para obtener los costos de envío y estimaciones de entrega más precisos, agrega
                artículos a tu carrito e ingresa tu dirección de envío al pagar.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Seguimiento de pedidos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Una vez que tu pedido sea enviado, recibirás un número de seguimiento por correo
              electrónico. Puedes rastrear tu paquete usando:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>El panel de tu cuenta en nuestro sitio web</li>
              <li>El enlace de seguimiento en tu correo de confirmación de envío</li>
              <li>Directamente en el sitio web del transportista</li>
              <li>Nuestra aplicación móvil (próximamente)</li>
            </ul>

            <div className="rounded-lg bg-card border p-6">
              <h3 className="mb-3 font-semibold">La información de seguimiento incluye:</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ul className="text-muted-foreground space-y-2">
                  <li>• Ubicación actual del paquete</li>
                  <li>• Fecha estimada de entrega</li>
                  <li>• Actualizaciones del estado de entrega</li>
                </ul>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Información del transportista</li>
                  <li>• Notificaciones de intentos de entrega</li>
                  <li>• Comprobante de entrega</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Información de entrega</h2>
          <div className="space-y-4 text-muted-foreground">
            <h3 className="text-xl font-medium">Requisitos de entrega:</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Alguien debe estar disponible para firmar paquetes superiores a $500</li>
              <li>Los paquetes pueden dejarse en tu puerta para entregas estándar</li>
              <li>Las entregas en apartamentos requieren acceso al edificio</li>
              <li>
                Las entregas a apartados postales están disponibles solo para artículos pequeños
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium">Problemas de entrega:</h3>
            <p>Si experimentas algún problema de entrega, contáctanos dentro de las 48 horas:</p>
            <div className="rounded-lg border bg-card p-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Paquete marcado como entregado pero no recibido</li>
                <li>• Paquete dañado al momento de la entrega</li>
                <li>• Dirección de entrega incorrecta</li>
                <li>• Múltiples intentos de entrega fallidos</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Servicios especiales de envío</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-6">
                <h3 className="mb-3 text-lg font-semibold">Entrega premium</h3>
                <p className="text-muted-foreground mb-3">
                  Disponible para artículos grandes o frágiles
                </p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Cita de entrega programada</li>
                  <li>• Manejo profesional y configuración</li>
                  <li>• Retiro del embalaje</li>
                  <li>• Se aplican cargos adicionales</li>
                </ul>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="mb-3 text-lg font-semibold">Retiro en instalación</h3>
                <p className="text-muted-foreground mb-3">
                  Retén paquetes en las instalaciones del transportista
                </p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Disponible en ubicaciones de FedEx y UPS</li>
                  <li>• Retención hasta por 7 días</li>
                  <li>• Se requiere identificación con foto para recoger</li>
                  <li>• Servicio gratuito</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Restricciones de envío</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Ten en cuenta las siguientes restricciones de envío:</p>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">Áreas restringidas</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Apartados postales (solo para artículos grandes)</li>
                <li>• Direcciones militares APO/FPO (contáctanos primero)</li>
                <li>• Áreas remotas o rurales (pueden aplicarse cargos adicionales)</li>
                <li>• Ciertos destinos internacionales</li>
              </ul>
            </div>

            <div className="mt-4 rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">Restricciones de productos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Baterías de litio (restricciones de envío internacional)</li>
                <li>• Artículos de gran tamaño (cargos de manejo adicionales)</li>
                <li>• Materiales peligrosos (no se pueden enviar)</li>
                <li>• Artículos de más de 150 lbs (se requieren arreglos especiales)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Contactar soporte de envíos</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>¿Necesitas ayuda con preguntas o problemas de envío?</p>
            <div className="rounded-lg bg-card border p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Departamento de envíos</h3>
                  <p>
                    <strong>Email:</strong> areska@store.com
                  </p>
                  <p>
                    <strong>Teléfono:</strong> 1-800-ARES-NOW
                  </p>
                  <p>
                    <strong>Horario:</strong> Lun-Vie 8AM-6PM EST
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Preguntas comunes</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Estado del pedido y seguimiento</li>
                    <li>• Cambios de dirección de envío</li>
                    <li>• Programación de entregas</li>
                    <li>• Cotizaciones de envíos internacionales</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
