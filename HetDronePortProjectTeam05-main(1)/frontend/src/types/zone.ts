export interface Point {
  lat: number | null;
  lng: number | null;
}

export interface Zone {
  name: string;
  maxHeight: number | null;
  path: Point[];
}
