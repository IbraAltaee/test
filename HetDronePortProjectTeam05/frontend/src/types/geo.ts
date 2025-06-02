export type GeoPoint = {
  lat: any;
  lng: any;
};

export interface PolygonZone {
  path: GeoPoint[];
  options: {
    strokeColor: string;
    fillColor: string;
  };
}

export type PolygonData = Record<string, PolygonZone>;
