"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Zone } from "@/types/zone";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

interface ZoneMapProps {
  zone: Zone;
  mapId: string;
}

const ZoneMap: React.FC<ZoneMapProps> = ({ zone, mapId }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const getValidPath = (): google.maps.LatLngLiteral[] => {
    return zone.path
      .filter((point) => point.lat !== null && point.lng !== null)
      .map((point) => ({ lat: point.lat!, lng: point.lng! }));
  };

  const validPath = getValidPath();

  useEffect(() => {
    if (map && validPath.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validPath.forEach((point) => bounds.extend(point));

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);

        setTimeout(() => {
          const zoom = map.getZoom();
          if (zoom && zoom > 15) {
            map.setZoom(15);
          }
        }, 100);
      }
    }
  }, [map, validPath, zone.path]);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    if (validPath.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validPath.forEach((point) => bounds.extend(point));

      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds);

        setTimeout(() => {
          const zoom = mapInstance.getZoom();
          if (zoom && zoom > 15) {
            mapInstance.setZoom(15);
          }
        }, 100);
      }
    }
  };

  const { zone: zoneTranslations } = useTranslations();

  return (
    <div className="h-96 w-full border rounded-lg overflow-hidden relative">
      <GoogleMap
        key={`${mapId}-${zone.path.length}-${JSON.stringify(validPath)}`}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: 50.788889, lng: 5.201667 }}
        zoom={10}
        onLoad={handleMapLoad}
      >
        {validPath.length >= 3 && (
          <Polygon
            key={`polygon-${JSON.stringify(validPath)}`}
            paths={validPath}
            options={{
              strokeColor: "#3B82F6",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#3B82F6",
              fillOpacity: 0.2,
              clickable: false,
              draggable: false,
              editable: false,
            }}
          />
        )}
      </GoogleMap>

      {validPath.length < 3 && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <p className="text-sm">{zoneTranslations("mapPreviewInfo")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneMap;