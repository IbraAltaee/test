"use client";

import React from "react";
import { NumberInput } from "../inputField";
import { FormDataValues } from "@/types/droneOperationFormState";
import { useTranslations } from "@/hooks/useTranslations";

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
      const { form } = useTranslations();

      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {form("flightGeography")}
          </h3>
          <NumberInput
            label={form("flightHeight")}
            value={data.heightFlight ?? ""}
            onChange={onHeightFlightChange}
            name="heightFlight"
            getFieldError={getFieldError}
            required
            step="any"
            helperText={
              data.maxUavDimensions
                ? form("atLeast3TimesDroneDimension") + ` (${(3 * data.maxUavDimensions).toFixed(2)}m)`
                : form("enterUAVDimsFirst")
            }
            infoText={form("flightHeightInfo")}
            maxHeightError={maxHeightError}
          />
          <NumberInput
            label={form("flightHeight") + " (ft) (AGL)"}
            value={data.heightFlightFt ?? ""}
            onChange={onHeightFlightFtChange}
            name="heightFlightFt"
            getFieldError={getFieldError}
            required
            step="any"
            helperText={
              data.maxUavDimensions
                ? form("atLeast3TimesDroneDimension") + ` (${((3 * data.maxUavDimensions) / 0.3048).toFixed(2)}ft)`
                : form("enterUAVDimsFirst")
            }
            infoText={form("flightHeightInfo")}
            maxHeightError={maxHeightError}
          />
        </div>
      );
    },
  );