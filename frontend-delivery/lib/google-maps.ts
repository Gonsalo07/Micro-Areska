const LOG_PREFIX = "[GoogleMaps]";

export function getGoogleMapsApiKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
    undefined
  );
}

export function getGoogleMapsApiKeySource(): "GOOGLE_MAPS" | "FIREBASE" | "NONE" {
  if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) return "GOOGLE_MAPS";
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()) return "FIREBASE";
  return "NONE";
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "***";
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

export function logMapsInfo(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.info(`${LOG_PREFIX} ${message}`, details);
    return;
  }
  console.info(`${LOG_PREFIX} ${message}`);
}

export function logMapsError(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.error(`${LOG_PREFIX} ${message}`, details);
    return;
  }
  console.error(`${LOG_PREFIX} ${message}`);
}

export function logMapsConfig() {
  const source = getGoogleMapsApiKeySource();
  const key = getGoogleMapsApiKey();

  console.group(`${LOG_PREFIX} Configuración`);
  logMapsInfo("Variables de entorno", {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? "definida"
      : "no definida",
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      ? "definida"
      : "no definida",
    keySource: source,
    keyPreview: key ? maskApiKey(key) : "sin key",
    origin: typeof window !== "undefined" ? window.location.origin : "ssr",
  });

  if (source === "FIREBASE") {
    logMapsInfo(
      "Usando key de Firebase. Si el mapa falla, crea NEXT_PUBLIC_GOOGLE_MAPS_API_KEY o habilita Maps en la misma key."
    );
  }

  logMapsInfo("APIs requeridas en Google Cloud (proyecto areska-21d63)", {
    required: [
      "Maps JavaScript API",
      "Directions API",
      "Places API (opcional, libraries=places)",
    ],
    billing: "Facturación activa en el proyecto",
    referrers: ["http://localhost:3001/*", "http://localhost:3000/*"],
  });
  console.groupEnd();
}

export const DIRECTIONS_STATUS_HINTS: Record<string, string> = {
  OK: "Ruta calculada correctamente.",
  NOT_FOUND: "Origen o destino no encontrado.",
  ZERO_RESULTS: "No hay ruta disponible entre origen y destino.",
  MAX_WAYPOINTS_EXCEEDED: "Demasiados waypoints en la solicitud.",
  INVALID_REQUEST: "Solicitud inválida (revisa coordenadas).",
  OVER_QUERY_LIMIT: "Cuota de Directions API excedida o billing inactivo.",
  REQUEST_DENIED: "Directions API denegada: habilítala y revisa restricciones de la key.",
  UNKNOWN_ERROR: "Error desconocido del servidor de Directions.",
};

export function computeHeadingDegrees(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function getDriverHeading(
  driverLocation: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  routePath: { lat: number; lng: number }[] = []
): number {
  if (routePath.length >= 2) {
    let closestIdx = 0;
    let minDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < routePath.length; i++) {
      const d = Math.hypot(
        routePath[i].lat - driverLocation.lat,
        routePath[i].lng - driverLocation.lng
      );
      if (d < minDist) {
        minDist = d;
        closestIdx = i;
      }
    }
    const nextIdx = Math.min(closestIdx + 1, routePath.length - 1);
    if (nextIdx !== closestIdx) {
      return computeHeadingDegrees(driverLocation, routePath[nextIdx]);
    }
  }
  return computeHeadingDegrees(driverLocation, destination);
}

export function createDriverArrowIcon(
  googleMaps: {
    Size: new (width: number, height: number) => unknown;
    Point: new (x: number, y: number) => unknown;
  },
  rotation = 0
) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">`,
    `<g transform="rotate(${rotation} 24 24)">`,
    `<circle cx="24" cy="24" r="21" fill="#4F46E5" stroke="#FFFFFF" stroke-width="3"/>`,
    `<path d="M24 9 L33 33 L24 27 L15 33 Z" fill="#FFFFFF"/>`,
    `</g>`,
    `</svg>`,
  ].join("");

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(48, 48),
    anchor: new googleMaps.Point(24, 24),
  };
}


export const MAPS_AUTH_CHECKLIST = [
  "Maps JavaScript API habilitada",
  "Directions API habilitada",
  "Facturación activa en el proyecto areska-21d63",
  "Términos de Google Maps Platform aceptados (Maps → Overview)",
  "Referrer http://localhost:3001/* en la API key",
  "La key debe permitir Maps JavaScript API (no solo APIs de Firebase)",
];

/** Errores que Google imprime en consola: "Google Maps JavaScript API error: ..." */
export const MAPS_JS_ERROR_HINTS: Record<string, string> = {
  BillingNotEnabledMapError:
    "Google no detecta billing en el proyecto de ESTA key. Verifica que la cuenta de facturación esté vinculada a areska-21d63.",
  ApiTargetBlockedMapError:
    "La API key está restringida y NO incluye Maps JavaScript API. Crea una key nueva para Maps o agrega Maps JS + Directions a las restricciones.",
  RefererNotAllowedMapError:
    "El referrer no coincide. Agrega http://localhost:3001/* y http://127.0.0.1:3001/* en restricciones HTTP.",
  ApiNotActivatedMapError:
    "Maps JavaScript API no está habilitada en el proyecto de esta key.",
  InvalidKeyMapError: "API key inválida o revocada.",
  OverQuotaMapError: "Cuota excedida o billing con problemas de pago.",
  MissingKeyMapError: "No se envió API key al cargar Maps.",
};

export function parseGoogleMapsConsoleError(message: string): {
  code: string | null;
  hint: string;
} {
  const match = message.match(/Google Maps JavaScript API error:\s*(\w+)/i);
  const code = match?.[1] ?? null;
  if (code && MAPS_JS_ERROR_HINTS[code]) {
    return { code, hint: MAPS_JS_ERROR_HINTS[code] };
  }
  if (message.toLowerCase().includes("development purposes only")) {
    return {
      code: "DevelopmentWatermark",
      hint:
        "Marca de agua de desarrollo: casi siempre es billing no vinculado al proyecto de la key, o key de Firebase sin Maps JavaScript API en restricciones.",
    };
  }
  return { code, hint: "Revisa Google Cloud → Maps → Overview del proyecto areska-21d63." };
}

export function attachGoogleMapsErrorListener(
  onError: (code: string | null, hint: string, raw: string) => void
): () => void {
  const handler = (event: ErrorEvent) => {
    const raw = event.message ?? "";
    if (!raw.includes("Google Maps")) return;
    const { code, hint } = parseGoogleMapsConsoleError(raw);
    onError(code, hint, raw);
  };
  window.addEventListener("error", handler);
  return () => window.removeEventListener("error", handler);
}
