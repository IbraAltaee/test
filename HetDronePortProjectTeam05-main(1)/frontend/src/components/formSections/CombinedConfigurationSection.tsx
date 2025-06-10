"use client";

import React, { useState, useRef, useEffect } from "react";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { useTranslations } from "@/hooks/useTranslations";
import {FaUpload, FaFileImport } from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";

type CombinedConfigurationSectionProps = {
  availableDrones: OptionType[];
  selectedDroneOption: OptionType | null;
  onSelectedDroneChange: (option: OptionType | null) => void;
  onLoad: () => void;
  
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
};

type ConfigMode = "import" | "drone" | "none";

export const CombinedConfigurationSection: React.FC<CombinedConfigurationSectionProps> = React.memo(
  ({
    onImportClick,
    fileInputRef,
    onFileChange,
    isProcessing,
    availableDrones,
    selectedDroneOption,
    onSelectedDroneChange,
    onLoad,
  }) => {
    const { form, dashboard } = useTranslations();
    const [configMode, setConfigMode] = useState<ConfigMode>("none");
    const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
    const droneSelectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (configMode === "drone" && droneSelectRef.current) {
        setTimeout(() => {
          droneSelectRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
          });
        }, 100);
      }
    }, [configMode]);

    const resetSelections = () => {
      onSelectedDroneChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleModeChange = (mode: ConfigMode) => {
      if (mode === configMode) {
        setConfigMode("none");
      } else {
        setConfigMode(mode);
      }
      resetSelections();
    };

    const toggleQuickSetup = () => {
      setIsQuickSetupOpen(!isQuickSetupOpen);
      if (isQuickSetupOpen) {
        setConfigMode("none");
        resetSelections();
      }
    };

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        {/* Toggle Header */}
        <button
          type="button"
          onClick={toggleQuickSetup}
          className="w-full flex items-center justify-between p-2 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <FaFileImport className="mr-2 text-blue-700" />
            <h3 className="text-lg font-semibold text-blue-900">
              {form("quickSetupOptions")}
            </h3>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-blue-600 mr-2">
              {isQuickSetupOpen ? form("hide") : form("show")}
            </span>
            <svg
              className={`w-5 h-5 text-blue-700 transition-transform duration-200 ${
                isQuickSetupOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Collapsible Content */}
        {isQuickSetupOpen && (
          <div className="mt-4 animate-fadeIn">
            <p className="text-sm text-blue-700 mb-4">
              {form("chooseOptionToQuicklySetup")}
            </p>



        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleModeChange("import")}
              disabled={isProcessing}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                configMode === "import"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaFileImport className="mr-2" />
              {form("importConfiguration")}
            </button>

            {availableDrones.length > 0 && (
              <button
                type="button"
                onClick={() => handleModeChange("drone")}
                disabled={isProcessing}
                className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  configMode === "drone"
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <GiDeliveryDrone className="mr-2" />
                {form("loadCommonDrone")}
              </button>
            )}
          </div>

          {configMode === "import" && (
            <div className="bg-white rounded-lg p-4 border border-blue-200 animate-fadeIn">
              <div className="flex items-center mb-3">
                <FaUpload className="text-blue-600 mr-2" />
                <h5 className="font-medium text-blue-900">{form("importConfigurationFile")}</h5>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {form("importConfigurationDescription")}
              </p>
              <button
                type="button"
                onClick={onImportClick}
                disabled={isProcessing}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUpload className="mr-2" />
                {form("chooseFile")}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          )}

          {configMode === "drone" && availableDrones.length > 0 && (
            <div 
              ref={droneSelectRef}
              className="bg-white rounded-lg p-4 border border-amber-200 animate-fadeIn"
            >
              <div className="flex items-center mb-3">
                <GiDeliveryDrone className="text-amber-600 mr-2" />
                <h5 className="font-medium text-amber-900">{form("loadCommonDroneSetup")}</h5>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {form("loadDroneNote")}
              </p>
              
              <div className="flex space-x-3 items-end">
                <div className="flex-1">
                  <SelectField
                    label={dashboard("selectADrone")}
                    name="selectedDrone"
                    value={selectedDroneOption}
                    onChange={onSelectedDroneChange}
                    options={availableDrones}
                    getFieldError={() => undefined}
                    placeholder={form("chooseDroneConfiguration")}
                    autoScrollOnOpen={true}
                  />
                </div>
                <button
                  type="button"
                  onClick={onLoad}
                  disabled={!selectedDroneOption || isProcessing}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-[9px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed mb-4 transition-colors"
                >
                  {form("loadDrones")}
                </button>
              </div>
                            <p className="text-sm text-red-600">
                *{form("loadDroneNote2")}
              </p>
            </div>
          )}
        </div>
          </div>
        )}
      </div>
    );
  }
);