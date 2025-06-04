"use client";

import React from "react";
import { NumberInput } from "../inputField";
import { FormDataValues } from "@/types/droneOperationFormState";

type FlightGeographySectionProps = {
  data: Pick<
    FormDataValues,
    "heightFlight" | "heightFlightFt" | "maxUavDimensions"
  >;
  maxHeightError?: string;
  onHeightFlightChange: (valueStr: string) => void;
  onHeightFlightFtChange: (valueStr: string) => void;
  getFieldError: (fieldName: string) => string | undefined;
};

export const FlightGeographySection: React.FC<FlightGeographySectionProps> =
  React.memo(
    ({
      data,
      maxHeightError,
      onHeightFlightChange,
      onHeightFlightFtChange,
      getFieldError,
    }) => {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Flight Geography
          </h3>
          <NumberInput
            label="Flight height (m) (AGL)"
            value={data.heightFlight ?? ""}
            onChange={onHeightFlightChange}
            name="heightFlight"
            getFieldError={getFieldError}
            required
            min={0.01}
            step="any"
            helperText={
              data.maxUavDimensions
                ? `At least 3x drone dimension (${(3 * data.maxUavDimensions).toFixed(2)}m)`
                : "Enter Max UAV Dimensions first"
            }
            infoText="Vertical extent for UAV operation (AGL)."
            maxHeightError={maxHeightError}
          />
          <NumberInput
            label="Flight height (ft) (AGL)"
            value={data.heightFlightFt ?? ""}
            onChange={onHeightFlightFtChange}
            name="heightFlightFt"
            getFieldError={getFieldError}
            required
            min={0.01}
            step="any"
            helperText={
              data.maxUavDimensions
                ? `At least 3x drone dimension (${((3 * data.maxUavDimensions) / 0.3048).toFixed(2)}ft)`
                : "Enter Max UAV Dimensions first"
            }
            infoText="Vertical extent for UAV operation (AGL)."
            maxHeightError={maxHeightError}
          />
        </div>
      );
    },
  );
