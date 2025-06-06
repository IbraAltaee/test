"use client";
import React from "react";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { useTranslations } from "@/hooks/useTranslations";

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
      const { dashboard, form } = useTranslations();

      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
            {form("loadSavedDrones")}
          </h3>
          <p className="text-sm text-amber-700 mb-4">{form("loadDroneNote")}</p>

          <div className="flex space-x-4 items-end">
            <SelectField
              label={dashboard("selectADrone")}
              name="selectedDrone"
              value={selectedDroneOption}
              onChange={onSelectedDroneChange}
              options={availableDrones}
              getFieldError={() => undefined}
              placeholder={form("chooseDroneConfiguration")}
              infoText={form("loadConfigurationTooltip")}
            />
            <button
              type="button"
              onClick={onLoad}
              disabled={!selectedDroneOption}
              className="items-end bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-[9px] rounded-md disabled:opacity-50 mb-4 transition-colors"
            >
              {form("loadDrones")}
            </button>
          </div>
        </div>
      );
    },
  );