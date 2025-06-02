import { GeoPoint } from "@/types/geo";
import { getDistance, computeDestinationPoint } from "geolib";

export const calculateBounds = (center: GeoPoint, distance: number) => {
  const north = computeDestinationPoint(center, distance, 0);
  const south = computeDestinationPoint(center, distance, 180);
  const east = computeDestinationPoint(center, distance, 90);
  const west = computeDestinationPoint(center, distance, 270);

  return {
    north: north.latitude,
    south: south.latitude,
    east: east.longitude,
    west: west.longitude,
  };
};

export const makeSquaresList = (
  flightGeography: any,
  contigencyVolume: any,
  groundRiskBuffer: any,
  adjacentVolume: any,
) => {
  const flightGeographyList = [
    { lat: flightGeography.north, lng: flightGeography.west },
    { lat: flightGeography.north, lng: flightGeography.east },
    { lat: flightGeography.south, lng: flightGeography.east },
    { lat: flightGeography.south, lng: flightGeography.west },
  ];

  const contigencyVolumeList = [
    { lat: contigencyVolume.north, lng: contigencyVolume.west },
    { lat: contigencyVolume.north, lng: contigencyVolume.east },
    { lat: contigencyVolume.south, lng: contigencyVolume.east },
    { lat: contigencyVolume.south, lng: contigencyVolume.west },
  ];

  const groundRiskBufferList = [
    { lat: groundRiskBuffer.north, lng: groundRiskBuffer.west },
    { lat: groundRiskBuffer.north, lng: groundRiskBuffer.east },
    { lat: groundRiskBuffer.south, lng: groundRiskBuffer.east },
    { lat: groundRiskBuffer.south, lng: groundRiskBuffer.west },
  ];

  const adjacentVolumeList = [
    { lat: adjacentVolume.north, lng: adjacentVolume.west },
    { lat: adjacentVolume.north, lng: adjacentVolume.east },
    { lat: adjacentVolume.south, lng: adjacentVolume.east },
    { lat: adjacentVolume.south, lng: adjacentVolume.west },
  ];

  return {
    flightGeographyList,
    contigencyVolumeList,
    groundRiskBufferList,
    adjacentVolumeList,
  };
};

const toCoordinatesString = (points: any) => {
  const closedPoints = [...points, points[0]]; // ensure polygon is closed
  return closedPoints.map((p) => `${p.lng},${p.lat},0`).join(" ");
};

export const generateKmlData = (squares: any) => {
  const areas = [
    {
      name: "Adjacent Volume",
      color: "ffaaaaaa",
      points: squares.adjacentVolumeList,
      index: 1,
    },
    {
      name: "Ground Risk Buffer",
      color: "ff0000ff",
      points: squares.groundRiskBufferList,
      index: 2,
    },
    {
      name: "Contingency Volume",
      color: "ff00ffff",
      points: squares.contigencyVolumeList,
      index: 3,
    },
    {
      name: "Flight Geography",
      color: "ff00ff00",
      points: squares.flightGeographyList,
      index: 4,
    },
  ];

  const placemarks = areas
    .map(
      (area) => `
    <Placemark>
      <name>${area.index} - ${area.name}</name>
      <Style>
        <PolyStyle>
          <color>${area.color}</color>
        </PolyStyle>
      </Style>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${toCoordinatesString(area.points)}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  `,
    )
    .join("");

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
      <name>Flight Area Squares</name>
      ${placemarks}
    </Document>
  </kml>`;
  return kml;
};
