"use client";
import React from "react";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";

type LoadConfigurationSectionProps = {
  availableDrones: OptionType[];
  selectedDroneOption: OptionType | null;
  onSelectedDroneChange: (option: OptionType | null) => void;
  onLoad: () => void;
};

export const LoadConfigurationSection: React.FC<LoadConfigurationSectionProps> =
  React.memo(
    ({
      availableDrones,
      selectedDroneOption,
      onSelectedDroneChange,
      onLoad,
    }) => {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Load Saved Configuration
          </h3>
          <div className="flex space-x-4 items-end">
            <SelectField
              label="Select a drone"
              name="selectedDrone"
              value={selectedDroneOption}
              onChange={onSelectedDroneChange}
              options={availableDrones}
              getFieldError={() => undefined}
              placeholder="Choose a drone configuration"
              infoText="Select a drone to automatically populate the form fields"
            />
            <button
              type="button"
              onClick={onLoad}
              disabled={!selectedDroneOption}
              className="items-end bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-[9px] rounded-md disabled:opacity-50 mb-4"
            >
              Load
            </button>
          </div>
        </div>
      );
    },
  );
