"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import IntroText from "@/components/IntroText";
import MapWithSquare from "@/components/map";
import ResultsSummary from "@/components/ResultsSummary";
import InputFormWrap from "@/components/wrappers/inputFormWrap";
import { useTranslations } from "@/hooks/useTranslations";
import { zoneService } from "@/services/ZoneService";
import { Zone } from "@/types/zone";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

const DroneOperationCalculator: React.FC = () => {
  const { map: mapTranslations, notifications } = useTranslations();

  const [activeTab, setActiveTab] = useState<"map" | "results">("map");
  const [formResponse, setFormResponse] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState<Zone>();
  const [zones, setZones] = useState<Zone[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [maxHeightError, setMaxHeightError] = useState<string>("");

  const fetchData = async () => {
    try {
      setMaxHeightError("");
      const data = await zoneService.getZonesGreaterThanMaxHeight(
        maxHeight! + 68,
      );

      if (!data || data.length === 0) {
        setMaxHeightError(notifications("noZonesFoundForHeight"));
        setZones([]);
        setSelectedPolygon(undefined);
        return;
      }
      setZones(data);
      setSelectedPolygon(data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [maxHeight]);

  return (
  <>
    <Head>
        <title>UAV Zone Guidance Tool</title>
    </Head>
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2500} />
      <header>
        <Header />
        <IntroText />
      </header>
      <main className="containermx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <InputFormWrap
              onCalculateResponse={setFormResponse}
              onHeightChange={setMaxHeight}
              maxHeightError={maxHeightError}
            />
            <div className="flex-grow"></div>
          </div>

          <div className="lg:w-3/3 mt-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-3 px-6 text-sm font-medium ${
                    activeTab === "map"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("map")}
                >
                  {mapTranslations("mapVisualization")}
                </button>
                {formResponse && (
                  <button
                    className={`py-3 px-6 text-sm font-medium ${
                      activeTab === "results"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("results")}
                  >
                    {mapTranslations("detailedResults")}
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4 mt-2 ml-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    {mapTranslations("availableZones")} ({zones.length})
                  </label>
                  <div className="group relative">
                    <FaInfoCircle className="text-gray-400 text-xs cursor-help" />
                    <div className="absolute left-6 top-0 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      {mapTranslations("zonesFilteredByHeight")}: {maxHeight}m
                    </div>
                  </div>
                </div>
                <select
                  value={selectedPolygon?.name || ""}
                  onChange={(e) => {
                    const selected = zones.find(
                      (zone) => zone.name === e.target.value,
                    );
                    if (selected) {
                      setSelectedPolygon(selected);
                    }
                  }}
                  className="p-2 border rounded w-48"
                  disabled={zones.length === 0}
                >
                  {zones.length === 0 ? (
                    <option value="">{mapTranslations("noZonesAvailable")}</option>
                  ) : (
                    zones.map((zone) => (
                      <option key={zone.name} value={zone.name}>
                        {zone.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="p-4">
                {activeTab === "map" ? (
                  <MapWithSquare data={formResponse} zone={selectedPolygon} />
                ) : (
                  <ResultsSummary data={formResponse} zone={selectedPolygon} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  </>
  );
};

export default DroneOperationCalculator;