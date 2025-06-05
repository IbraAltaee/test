"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import * as turf from "@turf/turf";
import {
  generatePolygonData,
  generateKmlFromPolygons,
  downloadKml,
  generate3DKMLFromPolygons,
  generateFlightGeography,
  generateKmlFromFlightGeography,
} from "@/utils/kmlPolygonGenerator";
import EmailService from "@/services/EmailService";
import { toast } from "react-toastify";
import { generateEmailBody } from "@/utils/generateEmailBody";
import { Zone } from "@/types/zone";
import { InfoIconComponent } from "./infoIcon";
import { FaDownload, FaEnvelope } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 50.788889,
  lng: 5.201667,
};

interface MapWithSquareProps {
  data: any;
  zone: any;
}
const MapWithSquare: React.FC<MapWithSquareProps> = ({ data, zone }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [insetPolygons, setInsetPolygons] = useState<any[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<Zone>(zone);
  const [zonePath, setZonePath] = useState<google.maps.LatLngLiteral[]>();

  const getValidPath = (zone: Zone): google.maps.LatLngLiteral[] => {
    return zone?.path
      .filter((point) => point.lat !== null && point.lng !== null)
      .map((point) => ({ lat: point.lat!, lng: point.lng! }));
  };

  useEffect(() => {
    setSelectedPolygon(zone);
    setZonePath(getValidPath(zone));
  }, [zone]);

  useEffect(() => {
    if (map && selectedPolygon && zone) {
      const bounds = new google.maps.LatLngBounds();

      zone.path.forEach((coord: any) => {
        bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
      });

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const paddingLat = (ne.lat() - sw.lat()) * 0.1;
      const paddingLng = (ne.lng() - sw.lng()) * 0.1;

      bounds.extend(
        new google.maps.LatLng(ne.lat() + paddingLat, ne.lng() + paddingLng),
      );
      bounds.extend(
        new google.maps.LatLng(sw.lat() - paddingLat, sw.lng() - paddingLng),
      );

      map.fitBounds(bounds);
    }
  }, [map, selectedPolygon]);

  const [email, setEmail] = useState("");
  const [downloadOptions, setDownloadOptions] = useState({
    kml: false,
    kml3D: false,
    flightGeography: false,
  });

  const sizeFlightGeography = useRef<number | null>(null);
  const sizeContigencyVolume = useRef<number | null>(null);
  const sizeGroundRiskBuffer = useRef<number | null>(null);
  const sizeAdjacentVolume = useRef<number | null>(null);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (data && zone) {
      const flightGeographySize = data.flightGeography.minWdith;
      const contigencyVolumeSize =
        flightGeographySize + 2 * data.lateralCV.lateralExtension;
      const groundRiskBufferSize =
        contigencyVolumeSize + 2 * data.grb.minLateralDimension;
      const adjacentVolumeSize =
        contigencyVolumeSize + 2 * data.adjacentVolume.lateralInMeter;

      sizeFlightGeography.current = flightGeographySize;
      sizeContigencyVolume.current = contigencyVolumeSize;
      sizeGroundRiskBuffer.current = groundRiskBufferSize;
      sizeAdjacentVolume.current = adjacentVolumeSize;

      const polygonCoords = zone.path.map((coord: any) => [
        coord.lng,
        coord.lat,
      ]);
      polygonCoords.push([polygonCoords[0][0], polygonCoords[0][1]]);
      const originalPolygon = turf.polygon([polygonCoords]);

      const firstInset = turf.buffer(
        originalPolygon,
        -data.grb.minLateralDimension,
        { units: "meters" },
      );
      const secondInset = turf.buffer(
        originalPolygon,
        -(data.grb.minLateralDimension + data.lateralCV.lateralExtension),
        { units: "meters" },
      );

      if (
        !secondInset ||
        secondInset.geometry.coordinates.length === 0 ||
        !firstInset ||
        firstInset.geometry.coordinates.length === 0
      ) {
        toast.error("Buffer zone is too large for this flight zone");
        setInsetPolygons([]);
      } else {
        setInsetPolygons([originalPolygon, firstInset, secondInset]);
      }
    }
  }, [data, selectedPolygon]);

  const renderInsetPolygons = () => {
    return insetPolygons.map((polygon, index) => {
      const coordinates = polygon.geometry.coordinates[0].map((coord: any) => ({
        lat: coord[1],
        lng: coord[0],
      }));
      const colors = ["#EF4444", "#FACC15", "#22C55E"];
      return (
        <Polygon
          key={index}
          paths={coordinates}
          options={{
            strokeColor: colors[index],
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: colors[index],
            fillOpacity: 0.5,
            zIndex: 5 + index,
          }}
        />
      );
    });
  };

  const handleDownloadKml = async () => {
    if (!data) return;

    const polygonKmlData = generatePolygonData(
      zone,
      data.grb.minLateralDimension,
      data.lateralCV.lateralExtension,
      data.adjacentVolume.lateralInMeter,
    );
    const kmlContent = generateKmlFromPolygons(polygonKmlData);
    const kmlFile = EmailService.generateKmlFile(polygonKmlData);
    downloadKml(kmlContent, `${selectedPolygon.name}_flight_zones.kml`);
    return kmlFile;
  };

  const handleDownload3DKML = async () => {
    if (!data) return;

    const polygonKmlData = generatePolygonData(
      selectedPolygon,
      data.grb.minLateralDimension,
      data.lateralCV.lateralExtension,
      data.adjacentVolume.lateralInMeter,
    );

    const kmlContent = generate3DKMLFromPolygons(polygonKmlData, {
      flightHeight: data.flightGeography.heightFlightGeo!,
      minVerticalExtension: data.verticalCV.minVerticalDimension!,
      adjacentVolumeHeight: data.adjacentVolume.verticalInMeter!,
    });

    const kmlFile = EmailService.generateKmlFile3D(polygonKmlData);
    downloadKml(kmlContent, `3D_${selectedPolygon.name}_flight_zones.kml`);
    return kmlFile;
  };

  const handleDownloadFlightGeographyKml = async () => {
    if (!data) return;

    const { flightGeography } = generateFlightGeography(
      selectedPolygon,
      data.grb.minLateralDimension,
      data.lateralCV.lateralExtension,
    );

    const kmlContent = generateKmlFromFlightGeography(flightGeography);

    const kmlFile = EmailService.generateFGKmlFile(
      selectedPolygon,
      data.grb.minLateralDimension,
      data.lateralCV.lateralExtension,
    );

    downloadKml(kmlContent, `${selectedPolygon.name}_flight_geography.kml`);

    return kmlFile;
  };

  const handleEmailClick = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const kmlFiles: File[] = [];
    if (downloadOptions.kml) {
      const polygonKmlData = generatePolygonData(
        zone,
        data.grb.minLateralDimension,
        data.lateralCV.lateralExtension,
        data.adjacentVolume.lateralInMeter,
      );
      const kmlFile = EmailService.generateKmlFile(polygonKmlData);

      if (kmlFile) {
        kmlFiles.push(kmlFile);
      }
    }
    if (downloadOptions.kml3D) {
      const polygonKmlData = generatePolygonData(
        selectedPolygon,
        data.grb.minLateralDimension,
        data.lateralCV.lateralExtension,
        data.adjacentVolume.lateralInMeter,
      );
      const kml3DFile = EmailService.generateKmlFile3D(polygonKmlData);
      if (kml3DFile) {
        kmlFiles.push(kml3DFile);
      }
    }
    if (downloadOptions.flightGeography) {
      const flightGeographyFile = EmailService.generateFGKmlFile(
        selectedPolygon,
        data.grb.minLateralDimension,
        data.lateralCV.lateralExtension,
      );
      if (flightGeographyFile) {
        kmlFiles.push(flightGeographyFile);
      }
    }

    const pdf = await EmailService.generatePDFFile(data);

    toast.info("Sending email...");
    const success = await EmailService.sendEmailToClient({
      to: email,
      subject: "Your KML File",
      files: [...kmlFiles, pdf],
    });
    const success2 = await EmailService.sendEmailNotification({
      to: process.env.NEXT_PUBLIC_DRONEPORT_EMAIL!,
      subject: "A new flight request has been generated",
      body: generateEmailBody(data),
      files: [...kmlFiles, pdf],
    });
    if (success && success2) {
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email, please try again.");
    }
  };

  const handleDownloadSelected = async () => {
    const kmlFiles: File[] = [];
    if (downloadOptions.kml) {
      const kmlFile = await handleDownloadKml();
      if (kmlFile) {
        kmlFiles.push(kmlFile);
      }
    }
    if (downloadOptions.kml3D) {
      const kml3DFile = await handleDownload3DKML();
      if (kml3DFile) {
        kmlFiles.push(kml3DFile);
      }
    }
    if (downloadOptions.flightGeography) {
      const flightGeographyFile = await handleDownloadFlightGeographyKml();
      if (flightGeographyFile) {
        kmlFiles.push(flightGeographyFile);
      }
    }
    const pdf: File = await EmailService.generatePDFFile(data);
    EmailService.sendEmailNotification({
      to: process.env.NEXT_PUBLIC_DRONEPORT_EMAIL!,
      subject: "A new flight request has been generated",
      body: generateEmailBody(data),
      files: [...kmlFiles, pdf],
    });
  };

  const handleCheckboxChange = (option: keyof typeof downloadOptions) => {
    setDownloadOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const hasSelectedOptions = Object.values(downloadOptions).some(Boolean);

  return (
    <>
      <div className="flex flex-col gap-4">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          onLoad={onMapLoad}
        >
          <Polygon
            paths={zonePath}
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: "#0000FF",
              fillOpacity: 0.15,
              clickable: false,
              draggable: false,
              editable: false,
              geodesic: false,
              zIndex: 0,
            }}
          />

          {renderInsetPolygons()}

          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md border border-gray-200 max-w-xs">
            <h3 className="font-bold text-sm mb-2 text-gray-800">
              Flight Zones
            </h3>
            <ul className="space-y-1.5">
              {insetPolygons.length > 2 && (
                <>
                  <li className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 mr-2 rounded-sm"></span>
                      <span className="text-gray-700">Flight Geography</span>
                    </div>
                    <span className="font-medium ml-2">
                      {(turf.area(insetPolygons[2]) / 1000000).toFixed(3)} km²
                    </span>
                  </li>

                  <li className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-yellow-400 mr-2 rounded-sm"></span>
                      <span className="text-gray-700">Contingency Volume</span>
                    </div>
                    <span className="font-medium ml-2">
                      {(
                        (turf.area(insetPolygons[1]) -
                          turf.area(insetPolygons[2])) /
                        1000000
                      ).toFixed(3)}{" "}
                      km²
                    </span>
                  </li>

                  <li className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded-sm"></span>
                      <span className="text-gray-700">Ground Risk Buffer</span>
                    </div>
                    <span className="font-medium ml-2">
                      {(
                        (turf.area(insetPolygons[0]) -
                          turf.area(insetPolygons[1])) /
                        1000000
                      ).toFixed(3)}{" "}
                      km²
                    </span>
                  </li>
                </>
              )}
            </ul>
            <div className="text-xs text-gray-500 mt-2 text-right">
              Areas in square kilometers
            </div>
          </div>
        </GoogleMap>

        {data && (
          <div className="max-w-3xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaDownload className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">
                    Download Files
                  </h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Download files directly to your device
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Select file types to download
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-2 hover:bg-green-100 rounded">
                      <input
                        type="checkbox"
                        checked={downloadOptions.kml}
                        onChange={() => handleCheckboxChange("kml")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />

                      <span className="ml-3 text-sm text-green-800 font-medium">
                        Standard KML
                      </span>
                      <InfoIconComponent text="Contains all zones in a flat 2D view. Ideal for general reference and planning in mapping tools." />
                    </label>
                    <label className="flex items-center p-2 hover:bg-green-100 rounded">
                      <input
                        type="checkbox"
                        checked={downloadOptions.kml3D}
                        onChange={() => handleCheckboxChange("kml3D")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-green-800 font-medium">
                        3D KML
                      </span>
                      <InfoIconComponent text="Visualize the zones in 3D to better understand spatial layout and vertical use. It can be imported in Google Earth to view it." />
                    </label>
                    <label className="flex items-center p-2 hover:bg-green-100 rounded">
                      <input
                        type="checkbox"
                        checked={downloadOptions.flightGeography}
                        onChange={() => handleCheckboxChange("flightGeography")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-green-800 font-medium">
                        Flight Geography KML
                      </span>
                      <InfoIconComponent text="Shows only the maximum flight boundaries. Import this kml in Skeyedrone to request your flight." />
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleDownloadSelected}
                  disabled={!hasSelectedOptions}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {hasSelectedOptions
                    ? `Download Selected (${
                        Object.values(downloadOptions).filter(Boolean).length
                      })`
                    : "Select files to download"}
                </button>
              </div>
              {hasSelectedOptions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 pt-10 ">
                  <div className="flex items-center mb-3">
                    <FaEnvelope className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-900">
                      Send via Email
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Email the selected KML files directly to your inbox
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Enter email address"
                    />
                  </div>
                  <button
                    onClick={handleEmailClick}
                    disabled={!email || !hasSelectedOptions}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send to Email
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MapWithSquare;