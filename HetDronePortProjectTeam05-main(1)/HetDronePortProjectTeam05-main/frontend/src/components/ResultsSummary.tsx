"use client";

import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "@/components/generatePDF";
import { useTranslations } from "@/hooks/useTranslations";

interface ResultsSummaryProps {
  data: any;
  zone: any;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ data, zone }) => {
  const { results } = useTranslations();
  
  const [expandedSections, setExpandedSections] = useState<{
    uav: boolean;
    flightGeography: boolean;
    lateralCV: boolean;
    verticalCV: boolean;
    grb: boolean;
    adjacentVolume: boolean;
  }>({
    uav: true,
    flightGeography: true,
    lateralCV: true,
    verticalCV: true,
    grb: true,
    adjacentVolume: true,
  });

  useEffect(() => {}, [zone]);

  const handleDownload = async () => {
    const blob = await pdf(<MyDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_results.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatValue = (value: any) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "number") return value.toFixed(2);
    return value.toString();
  };

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>{results("noCalculationResults")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md m-4 text-gray-800 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        {results("calculationResults")} {zone.name}
      </h2>

      {!data.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold">{results("error")}</h3>
          <p>{data.errorMessage || results("errorOccurred")}</p>
        </div>
      )}

      {data.warnings && data.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold">{results("warnings")}</h3>
          <ul className="list-disc ml-5 mt-2">
            {data.warnings.map((warning: string, index: number) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("uav")}
          >
            <span className="font-semibold text-gray-700">
              {results("uavSpecifications")}
            </span>
            {expandedSections.uav ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {expandedSections.uav && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("type")}:</span>
                  <span className="font-medium">{data.uav.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("maxSpeed")}:</span>
                  <span className="font-medium">
                    {formatValue(data.uav.maxOperationalSpeed)} m/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("characteristicDimension")}:
                  </span>
                  <span className="font-medium">
                    {formatValue(data.uav.maxCharacteristicDimension)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("altitudeMeasurementErrorType")}:
                  </span>
                  <span className="font-medium">
                    {data.uav.altitudeMeasurementErrorType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("altitudeMeasurementError")}:
                  </span>
                  <span className="font-medium">
                    {formatValue(data.uav.altitudeMeasurementError)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("gpsInaccuracy")}:</span>
                  <span className="font-medium">
                    {formatValue(data.uav.gpsInaccuracy)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("positionHoldingError")}:</span>
                  <span className="font-medium">
                    {formatValue(data.uav.positionHoldingError)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("mapError")}:</span>
                  <span className="font-medium">
                    {formatValue(data.uav.mapError)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("responseTime")}:</span>
                  <span className="font-medium">
                    {formatValue(data.uav.responseTime)} s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("flightGeography")}
          >
            <span className="font-semibold text-gray-700">
              {results("flightGeography")}
            </span>
            {expandedSections.flightGeography ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </button>
          {expandedSections.flightGeography && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("height")}:</span>
                  <span className="font-medium">
                    {formatValue(data.flightGeography.heightFlightGeo)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("minimumHeight")}:</span>
                  <span className="font-medium">
                    {formatValue(data.flightGeography.minHeight)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("minimumWidth")}:</span>
                  <span className="font-medium">
                    {formatValue(data.flightGeography.minWdith)} m
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("lateralCV")}
          >
            <span className="font-semibold text-gray-700">
              {results("lateralContingencyVolume")}
            </span>
            {expandedSections.lateralCV ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </button>
          {expandedSections.lateralCV && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("contingencyManoeuvre")}:</span>
                  <span className="font-medium">
                    {data.lateralCV.contingencyManoeuvre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("lateralExtension")}:</span>
                  <span className="font-medium">
                    {formatValue(data.lateralCV.lateralExtension)} m
                  </span>
                </div>
                {data.lateralCV.contingencyManoeuvre === "TURN_180" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{results("rollAngle")}:</span>
                    <span className="font-medium">
                      {formatValue(data.lateralCV.rollAngle)}°
                    </span>
                  </div>
                )}
                {data.lateralCV.contingencyManoeuvre === "STOPPING" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{results("pitchAngle")}:</span>
                    <span className="font-medium">
                      {formatValue(data.lateralCV.pitchAngle)}°
                    </span>
                  </div>
                )}
                {data.lateralCV.contingencyManoeuvre ===
                  "PARACHUTE_TERMINATION" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {results("timeToOpenParachute")}:
                    </span>
                    <span className="font-medium">
                      {formatValue(data.lateralCV.timeToOpenParachute)} s
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("verticalCV")}
          >
            <span className="font-semibold text-gray-700">
              {results("verticalContingencyVolume")}
            </span>
            {expandedSections.verticalCV ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </button>
          {expandedSections.verticalCV && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("contingencyManoeuvre")}:</span>
                  <span className="font-medium">
                    {data.verticalCV.contingencyManoeuvre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("heightContingencyManoeuvre")}:
                  </span>
                  <span className="font-medium">
                    {formatValue(data.verticalCV.heightContingencyManoeuvre)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("minimumVerticalDimension")}:
                  </span>
                  <span className="font-medium">
                    {formatValue(data.verticalCV.minVerticalDimension)} m
                  </span>
                </div>
                {data.verticalCV.contingencyManoeuvre ===
                  "PARACHUTE_TERMINATION" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {results("timeToOpenParachute")}:
                    </span>
                    <span className="font-medium">
                      {formatValue(data.verticalCV.timeToOpenParachute)} s
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("grb")}
          >
            <span className="font-semibold text-gray-700">
              {results("groundRiskBuffer")}
            </span>
            {expandedSections.grb ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {expandedSections.grb && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("terminationType")}:</span>
                  <span className="font-medium">{data.grb.termination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {results("minimumLateralDimension")}:
                  </span>
                  <span className="font-medium">
                    {formatValue(data.grb.minLateralDimension)} m
                  </span>
                </div>
                {data.grb.termination === "PARACHUTE" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {results("timeToOpenParachute")}:
                      </span>
                      <span className="font-medium">
                        {formatValue(data.grb.timeToOpenParachute)} s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {results("maxPermissibleWindSpeed")}:
                      </span>
                      <span className="font-medium">
                        {formatValue(data.grb.maxPermissibleWindSpeed)} m/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{results("rateOfDescent")}:</span>
                      <span className="font-medium">
                        {formatValue(data.grb.rateOfDescent)} m/s
                      </span>
                    </div>
                  </>
                )}
                {data.grb.termination === "OFF_GLIDING" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{results("glideRatio")}:</span>
                    <span className="font-medium">
                      {formatValue(data.grb.glideRatio)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => toggleSection("adjacentVolume")}
          >
            <span className="font-semibold text-gray-700">{results("adjacentVolume")}</span>
            {expandedSections.adjacentVolume ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </button>
          {expandedSections.adjacentVolume && (
            <div className="px-4 py-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("lateralInMeter")}:</span>
                  <span className="font-medium">
                    {formatValue(data.adjacentVolume?.lateralInMeter)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{results("verticalInMeter")}:</span>
                  <span className="font-medium">
                    {formatValue(data.adjacentVolume?.verticalInMeter)} m
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-500">
          <p>{results("calculationTime")}: {data.calculationTimeMs} ms</p>
          <p>
            {results("timestamp")}:{" "}
            {data.calculationTimestamp || new Date().toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {results("downloadAsPdf")}
        </button>
      </div>
    </div>
  );
};

export default ResultsSummary;