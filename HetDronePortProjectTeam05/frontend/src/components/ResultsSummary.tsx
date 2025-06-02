"use client";

import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Document, Page, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import MyDocument from "@/components/generatePDF";

interface ResultsSummaryProps {
    data: any;
    zone: any;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ data, zone }) => {
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


    
    useEffect(() => {}, [zone])

    const handleDownload = async () => {
        const blob = await pdf(<MyDocument data={data}/>).toBlob();
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
                <p>No calculation results available</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md m-4 text-gray-800 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Calculation Results for {zone.name}</h2>

            {!data.success && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold">Error</h3>
                    <p>{data.errorMessage || "An error occurred during calculation"}</p>
                </div>
            )}

            {data.warnings && data.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold">Warnings</h3>
                    <ul className="list-disc ml-5 mt-2">
                        {data.warnings.map((warning: string, index: number) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                {/* UAV Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("uav")}
                    >
                        <span className="font-semibold text-gray-700">UAV Specifications</span>
                        {expandedSections.uav ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.uav && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">{data.uav.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max Speed:</span>
                                    <span className="font-medium">{formatValue(data.uav.maxOperationalSpeed)} m/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Characteristic Dimension:</span>
                                    <span className="font-medium">{formatValue(data.uav.maxCharacteristicDimension)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Altitude Measurement Error Type:</span>
                                    <span className="font-medium">{data.uav.altitudeMeasurementErrorType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Altitude Measurement Error:</span>
                                    <span className="font-medium">{formatValue(data.uav.altitudeMeasurementError)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GPS Inaccuracy:</span>
                                    <span className="font-medium">{formatValue(data.uav.gpsInaccuracy)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Position Holding Error:</span>
                                    <span className="font-medium">{formatValue(data.uav.positionHoldingError)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Map Error:</span>
                                    <span className="font-medium">{formatValue(data.uav.mapError)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Response Time:</span>
                                    <span className="font-medium">{formatValue(data.uav.responseTime)} s</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Flight Geography Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("flightGeography")}
                    >
                        <span className="font-semibold text-gray-700">Flight Geography</span>
                        {expandedSections.flightGeography ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.flightGeography && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Height:</span>
                                    <span className="font-medium">{formatValue(data.flightGeography.heightFlightGeo)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Minimum Height:</span>
                                    <span className="font-medium">{formatValue(data.flightGeography.minHeight)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Minimum Width:</span>
                                    <span className="font-medium">{formatValue(data.flightGeography.minWdith)} m</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lateral Contingency Volume Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("lateralCV")}
                    >
                        <span className="font-semibold text-gray-700">Lateral Contingency Volume</span>
                        {expandedSections.lateralCV ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.lateralCV && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Contingency Manoeuvre:</span>
                                    <span className="font-medium">{data.lateralCV.contingencyManoeuvre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lateral Extension:</span>
                                    <span className="font-medium">{formatValue(data.lateralCV.lateralExtension)} m</span>
                                </div>
                                {data.lateralCV.contingencyManoeuvre === "TURN_180" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Roll Angle:</span>
                                        <span className="font-medium">{formatValue(data.lateralCV.rollAngle)}°</span>
                                    </div>
                                )}
                                {data.lateralCV.contingencyManoeuvre === "STOPPING" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pitch Angle:</span>
                                        <span className="font-medium">{formatValue(data.lateralCV.pitchAngle)}°</span>
                                    </div>
                                )}
                                {data.lateralCV.contingencyManoeuvre === "PARACHUTE_TERMINATION" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time to Open Parachute:</span>
                                        <span className="font-medium">{formatValue(data.lateralCV.timeToOpenParachute)} s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical Contingency Volume Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("verticalCV")}
                    >
                        <span className="font-semibold text-gray-700">Vertical Contingency Volume</span>
                        {expandedSections.verticalCV ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.verticalCV && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Contingency Manoeuvre:</span>
                                    <span className="font-medium">{data.verticalCV.contingencyManoeuvre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Height Contingency Manoeuvre:</span>
                                    <span className="font-medium">{formatValue(data.verticalCV.heightContingencyManoeuvre)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Minimum Vertical Dimension:</span>
                                    <span className="font-medium">{formatValue(data.verticalCV.minVerticalDimension)} m</span>
                                </div>
                                {data.verticalCV.contingencyManoeuvre === "PARACHUTE_TERMINATION" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time to Open Parachute:</span>
                                        <span className="font-medium">{formatValue(data.verticalCV.timeToOpenParachute)} s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ground Risk Buffer Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("grb")}
                    >
                        <span className="font-semibold text-gray-700">Ground Risk Buffer</span>
                        {expandedSections.grb ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.grb && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Termination Type:</span>
                                    <span className="font-medium">{data.grb.termination}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Minimum Lateral Dimension:</span>
                                    <span className="font-medium">{formatValue(data.grb.minLateralDimension)} m</span>
                                </div>
                                {data.grb.termination === "PARACHUTE" && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time to Open Parachute:</span>
                                            <span className="font-medium">{formatValue(data.grb.timeToOpenParachute)} s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Max Permissible Wind Speed:</span>
                                            <span className="font-medium">{formatValue(data.grb.maxPermissibleWindSpeed)} m/s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rate of Descent:</span>
                                            <span className="font-medium">{formatValue(data.grb.rateOfDescent)} m/s</span>
                                        </div>
                                    </>
                                )}
                                {data.grb.termination === "OFF_GLIDING" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Glide Ratio:</span>
                                        <span className="font-medium">{formatValue(data.grb.glideRatio)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Adjacent Volume Section */}
                <div className="bg-gray-50">
                    <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                        onClick={() => toggleSection("adjacentVolume")}
                    >
                        <span className="font-semibold text-gray-700">Adjacent Volume</span>
                        {expandedSections.adjacentVolume ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {expandedSections.adjacentVolume && (
                        <div className="px-4 py-3 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lateral In Meter:</span>
                                    <span className="font-medium">{formatValue(data.adjacentVolume?.lateralInMeter)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vertical In Meter:</span>
                                    <span className="font-medium">{formatValue(data.adjacentVolume?.verticalInMeter)} m</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                    <p>Calculation Time: {data.calculationTimeMs} ms</p>
                    <p>Timestamp: {data.calculationTimestamp || new Date().toLocaleString()}</p>
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );
};

export default ResultsSummary;
