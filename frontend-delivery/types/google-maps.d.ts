declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
  }

  class Marker {
    constructor(options?: MarkerOptions);
  }

  interface MapOptions {
    center?: LatLngLiteral;
    zoom?: number;
    styles?: MapTypeStyle[];
  }

  interface MarkerOptions {
    position?: LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface Icon {
    url: string;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: object[];
  }
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export {};
