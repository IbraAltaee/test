import * as turf from "@turf/turf";

export const turfPolygonToCoordinates = (
  polygon: any,
): { lat: number; lng: number }[] => {
  if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) {
    return [];
  }

  const coordinates = polygon.geometry.coordinates[0];
  return coordinates.map((coord: number[]) => ({
    lat: coord[1],
    lng: coord[0],
  }));
};

export const toCoordinatesString = (
  points: { lat: number; lng: number }[],
  baseAltitude: number = 0,
  topAltitude: number = 0,
): string => {
  if (points.length === 0) return "";

  const closedPoints = [...points];
  if (
    points.length > 0 &&
    (points[0].lat !== points[points.length - 1].lat ||
      points[0].lng !== points[points.length - 1].lng)
  ) {
    closedPoints.push(points[0]);
  }

  if (topAltitude > baseAltitude) {
    const bottomCoords = closedPoints
      .map((p) => `${p.lng},${p.lat},${baseAltitude}`)
      .join(" ");
    const topCoords = [...closedPoints]
      .map((p) => `${p.lng},${p.lat},${topAltitude}`)
      .join(" ");
    return bottomCoords + " " + topCoords;
  }

  return closedPoints.map((p) => `${p.lng},${p.lat},${baseAltitude}`).join(" ");
};

export const generatePolygonData = (
  selectedPolygon: any,
  groundRiskBuffer: number,
  contingencyVolume: number,
  adjacentVolume: number,
) => {
  const polygonCoords = selectedPolygon.path.map((coord: any) => [
    coord.lng,
    coord.lat,
  ]);

  if (
    polygonCoords.length > 0 &&
    (polygonCoords[0][0] !== polygonCoords[polygonCoords.length - 1][0] ||
      polygonCoords[0][1] !== polygonCoords[polygonCoords.length - 1][1])
  ) {
    polygonCoords.push([polygonCoords[0][0], polygonCoords[0][1]]);
  }

  const originalPolygon = turf.polygon([polygonCoords]);

  const flightGeographyPolygon = turf.buffer(
    originalPolygon,
    -(groundRiskBuffer + contingencyVolume),
    { units: "meters" },
  );

  const contingencyVolumePolygon = turf.buffer(
    originalPolygon,
    -groundRiskBuffer,
    { units: "meters" },
  );

  const groundRiskBufferPolygon = originalPolygon;

  const adjacentVolumePolygon = turf.buffer(originalPolygon, adjacentVolume, {
    units: "meters",
  });

  return {
    adjacentVolume: turfPolygonToCoordinates(adjacentVolumePolygon),
    groundRiskBuffer: turfPolygonToCoordinates(groundRiskBufferPolygon),
    contingencyVolume: turfPolygonToCoordinates(contingencyVolumePolygon),
    flightGeography: turfPolygonToCoordinates(flightGeographyPolygon),
  };
};

export const generateFlightGeography = (
  selectedPolygon: any,
  groundRiskBuffer: number,
  contingencyVolume: number,
) => {
  const polygonCoords = selectedPolygon.path.map((coord: any) => [
    coord.lng,
    coord.lat,
  ]);

  if (
    polygonCoords.length > 0 &&
    (polygonCoords[0][0] !== polygonCoords[polygonCoords.length - 1][0] ||
      polygonCoords[0][1] !== polygonCoords[polygonCoords.length - 1][1])
  ) {
    polygonCoords.push([polygonCoords[0][0], polygonCoords[0][1]]);
  }

  const originalPolygon = turf.polygon([polygonCoords]);

  const flightGeographyPolygon = turf.buffer(
    originalPolygon,
    -(groundRiskBuffer + contingencyVolume),
    { units: "meters" },
  );

  return {
    flightGeography: turfPolygonToCoordinates(flightGeographyPolygon),
  };
};

export const generateKmlFromPolygons = (polygonData: {
  adjacentVolume: { lat: number; lng: number }[];
  groundRiskBuffer: { lat: number; lng: number }[];
  contingencyVolume: { lat: number; lng: number }[];
  flightGeography: { lat: number; lng: number }[];
}) => {
  const areas = [
    {
      name: "Adjacent Volume",
      color: "66000000",
      points: polygonData.adjacentVolume,
      index: 1,
    },
    {
      name: "Ground Risk Buffer",
      color: "aa0000ff", // Semi-transparent red
      points: polygonData.groundRiskBuffer,
      index: 2,
    },
    {
      name: "Contingency Volume",
      color: "6600ffff", // Semi-transparent yellow
      points: polygonData.contingencyVolume,
      index: 3,
    },
    {
      name: "Flight Geography",
      color: "6600ff00", // Semi-transparent green
      points: polygonData.flightGeography,
      index: 4,
    },
  ];

  const placemarks = areas
    .filter((area) => area.points.length > 0) // Only include areas with valid coordinates
    .map(
      (area) => `
    <Placemark>
      <name>${area.index} - ${area.name}</name>
      <Style>
        <PolyStyle>
          <color>${area.color}</color>
          <outline>1</outline>
        </PolyStyle>
        <LineStyle>
          <color>${area.color}</color>
          <width>2</width>
        </LineStyle>
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
    <name>Flight Area Polygons</name>
    <description>Generated flight zones with ground risk buffer, contingency volume, and flight geography</description>
    ${placemarks}
  </Document>
</kml>`;

  return kml;
};

export const generateKmlFromFlightGeography = (
  flightGeography: {
    lat: number;
    lng: number;
  }[],
) => {
  if (flightGeography.length === 0) return "";

  const placemark = `
    <Placemark>
      <name>1 - Flight Geography</name>
      <Style>
        <PolyStyle>
          <color>6600ff00</color> <!-- Semi-transparent green -->
          <outline>1</outline>
        </PolyStyle>
        <LineStyle>
          <color>6600ff00</color>
          <width>2</width>
        </LineStyle>
      </Style>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${toCoordinatesString(flightGeography)}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  `;

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Flight Geography</name>
    <description>Generated flight geography polygon</description>
    ${placemark}
  </Document>
</kml>`;

  return kml;
};

export const generate3DKMLFromPolygons = (
  polygonData: {
    adjacentVolume: { lat: number; lng: number }[];
    groundRiskBuffer: { lat: number; lng: number }[];
    contingencyVolume: { lat: number; lng: number }[];
    flightGeography: { lat: number; lng: number }[];
  },
  operationData: {
    flightHeight?: number;
    adjacentVolumeHeight?: number;
    minVerticalExtension?: number;
  } = {},
) => {
  const flightHeight = operationData.flightHeight || this || 120; // Default 120m (typical drone ceiling)

  const maxHeights = {
    flightGeography: flightHeight,
    contingencyVolume: operationData.minVerticalExtension,
    groundRiskBuffer: 0,
    adjacentVolume: operationData.adjacentVolumeHeight,
  };

  const areas = [
    {
      name: "Adjacent Volume",
      color: "66000000", // Semi-transparent black
      points: polygonData.adjacentVolume,
      index: 1,
      maxHeight: maxHeights.adjacentVolume,
    },
    {
      name: "Ground Risk Buffer",
      color: "aa0000ff", // Semi-transparent red
      points: polygonData.groundRiskBuffer,
      index: 2,
      maxHeight: maxHeights.groundRiskBuffer,
    },
    {
      name: "Contingency Volume",
      color: "6600ffff", // Semi-transparent yellow
      points: polygonData.contingencyVolume,
      index: 3,
      maxHeight: maxHeights.contingencyVolume,
    },
    {
      name: "Flight Geography",
      color: "6600ff00", // Semi-transparent green
      points: polygonData.flightGeography,
      index: 4,
      maxHeight: maxHeights.flightGeography,
    },
  ];

  const ordered = areas.slice().sort((a, b) => b.index - a.index);
  let placemarks = "";

  for (let i = 0; i < ordered.length; i++) {
    const area = ordered[i];

    // For 2nd placemark (index 1 in zero-based), make it 2D:
    const isSecond = i === 2;

    const extrude = isSecond ? 0 : 1;
    const altitudeMode = isSecond ? "clampToGround" : "relativeToGround";

    // For 2D layer, altitude = 0; for others use maxHeight
    const altitude = isSecond ? 0 : area.maxHeight;

    placemarks += `
  <Placemark>
    <name>${area.index} - ${area.name}</name>
    <Style>
      <PolyStyle><color>${area.color}</color><outline>1</outline></PolyStyle>
      <LineStyle><color>${area.color}</color><width>2</width></LineStyle>
    </Style>
    <Polygon>
      <extrude>${extrude}</extrude>
      <altitudeMode>${altitudeMode}</altitudeMode>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            ${toCoordinatesString(area.points, altitude)}
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
  </Placemark>`;
  }

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Flight Area Polygons (3D)</name>
    <description>Generated 3D flight zones with ground risk buffer, contingency volume, and flight geography</description>
    ${placemarks}
  </Document>
</kml>`;

  return kml;
};

export const downloadKml = (
  kmlData: string,
  filename: string = "flight_zones.kml",
) => {
  const blob = new Blob([kmlData], {
    type: "application/vnd.google-earth.kml+xml",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
