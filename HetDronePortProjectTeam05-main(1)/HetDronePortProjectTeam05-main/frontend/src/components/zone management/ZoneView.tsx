"use client";

import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Zone } from "@/types/zone";
import PointList from "./PointList";
import ZoneMap from "./ZoneMap";
import { useTranslations } from "@/hooks/useTranslations";

interface ZoneViewProps {
  zone: Zone;
  onBack: () => void;
}

const ZoneView: React.FC<ZoneViewProps> = ({ zone, onBack }) => {
  const { zone: zoneTranslations, dashboard } = useTranslations();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {dashboard("adminDashboard")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft />
              </button>
              <h3 className="text-xl font-semibold">
                {zoneTranslations("viewZone")}: {zone.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">
                  {zoneTranslations("zoneName")}
                </span>
                <span className="text-gray-900">{zone.name}</span>
              </div>
              {zone.maxHeight && (
                <div className="flex flex-col">
                  <span className="text-gray-500 font-medium">
                    {zoneTranslations("maxFlightHeight")}
                  </span>
                  <span className="text-gray-900">
                    {zone.maxHeight.toFixed(2)}m /{" "}
                    {(zone.maxHeight * 3.28084).toFixed(2)}ft
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <PointList zone={zone} editable={false} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">
                {zoneTranslations("mapPreview")}
              </h4>
              <ZoneMap zone={zone} mapId={`view-${zone.name}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneView;