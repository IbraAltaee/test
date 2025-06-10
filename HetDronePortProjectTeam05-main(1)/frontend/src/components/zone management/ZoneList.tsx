"use client";

import React from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaMapMarkerAlt } from "react-icons/fa";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import { Zone } from "@/types/zone";
import { useTranslations } from "@/hooks/useTranslations";

interface ZoneListProps {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  onViewZone: (zone: Zone) => void;
  onEditZone: (zone: Zone) => void;
  onDeleteZone: (zoneName: string) => void;
  onCreateZone: () => void;
}

const ZoneCard: React.FC<{
  zone: Zone;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ zone, onView, onEdit, onDelete }) => {
  const { dashboard } = useTranslations();
  
  const validPoints = zone.path.filter(
    (point) => point.lat !== null && point.lng !== null
  );

  // Calculate approximate center for the zone
  const centerLat = validPoints.length > 0 
    ? validPoints.reduce((sum, point) => sum + (point.lat || 0), 0) / validPoints.length
    : 50.788889; // Default center (Liège area)
  const centerLng = validPoints.length > 0
    ? validPoints.reduce((sum, point) => sum + (point.lng || 0), 0) / validPoints.length
    : 5.201667;

  // Convert zone points to Google Maps format
  const getValidPath = (): google.maps.LatLngLiteral[] => {
    return validPoints.map((point) => ({ 
      lat: point.lat!, 
      lng: point.lng! 
    }));
  };

  const validPath = getValidPath();

  const mapContainerStyle = {
    width: "100%",
    height: "160px",
    borderRadius: "8px"
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: "none",
    clickableIcons: false,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  const handleMapLoad = (map: google.maps.Map) => {
    if (validPath.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validPath.forEach((point) => bounds.extend(point));
      
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        // Add some padding
        setTimeout(() => {
          const zoom = map.getZoom();
          if (zoom && zoom > 16) {
            map.setZoom(16);
          }
        }, 100);
      }
    } else {
      map.setCenter({ lat: centerLat, lng: centerLng });
      map.setZoom(12);
    }
  };

  const createZonePreview = () => {
    if (validPoints.length < 3) {
      return (
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FaMapMarkerAlt className="mx-auto text-gray-400 mb-2" size={24} />
            <span className="text-gray-500 text-sm font-medium">
              {dashboard("insufficientPoints")}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              {dashboard("needAtLeast3Points")}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: centerLat, lng: centerLng }}
          zoom={12}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {validPath.length >= 3 && (
            <Polygon
              paths={validPath}
              options={{
                strokeColor: "#3b82f6",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
                clickable: false,
                draggable: false,
                editable: false,
              }}
            />
          )}
        </GoogleMap>
      </div>
    );
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300">
      {/* Zone map visualization */}
      <div className="relative">
        {createZonePreview()}
        
        {/* Overlay with actions - appears on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button
              onClick={onView}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors transform hover:scale-110 shadow-lg"
              title={dashboard("viewZone")}
            >
              <FaEye size={16} />
            </button>
            <button
              onClick={onEdit}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors transform hover:scale-110 shadow-lg"
              title={dashboard("editZone")}
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors transform hover:scale-110 shadow-lg"
              title={dashboard("deleteZone")}
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Zone info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
            {zone.name}
          </h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
            {validPoints.length} {dashboard("points")}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" size={12} />
            <span className="truncate">
              {validPoints.length >= 3 ? (
                <>
                  {dashboard("center")}: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
                </>
              ) : (
                dashboard("incompleteZone")
              )}
            </span>
          </div>
          
          {zone.maxHeight && (
            <div className="flex items-center">
              <span className="mr-2 text-gray-400">📏</span>
              <span className="truncate">
                {dashboard("maxHeight")}: {zone.maxHeight.toFixed(0)}m ({(zone.maxHeight * 3.28084).toFixed(0)}ft)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ZoneList: React.FC<ZoneListProps> = ({
  zones,
  loading,
  error,
  onViewZone,
  onEditZone,
  onDeleteZone,
  onCreateZone,
}) => {
  const { dashboard } = useTranslations();

  // Scroll to top helper function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Enhanced handlers that scroll to top
  const handleViewZone = (zone: Zone) => {
    scrollToTop();
    setTimeout(() => onViewZone(zone), 100); // Small delay to ensure smooth scroll starts
  };

  const handleEditZone = (zone: Zone) => {
    scrollToTop();
    setTimeout(() => onEditZone(zone), 100);
  };

  const handleCreateZone = () => {
    scrollToTop();
    setTimeout(() => onCreateZone(), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard("zoneManagement")}</h3>
          <p className="text-gray-600 mt-1">
            {zones.length} {dashboard("zones")} • {dashboard("manageFlightZones")}
          </p>
        </div>
        <button
          onClick={handleCreateZone}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <FaPlus /> {dashboard("createZone")}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {dashboard("loadingZones")}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {zones.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dashboard("noZonesYet")}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {dashboard("noZonesFound")}
          </p>
          <button
            onClick={handleCreateZone}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> {dashboard("createFirstZone")}
          </button>
        </div>
      )}

      {!loading && zones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.name}
              zone={zone}
              onView={() => handleViewZone(zone)}
              onEdit={() => handleEditZone(zone)}
              onDelete={() => onDeleteZone(zone.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoneList;