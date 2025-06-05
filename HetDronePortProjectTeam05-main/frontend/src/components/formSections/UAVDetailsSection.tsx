"use client";

import React from "react";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import {
  FormDataValues,
  DroneOperationFormState,
} from "@/types/droneOperationFormState";
import { droneTypes, altitudeOptions } from "@/constants/options";
import { ValidationRule } from "@/types/validationRule";
import { useTranslations } from "@/hooks/useTranslations";

type UAVDetailsSectionProps = {
  data: Pick<
    FormDataValues,
    | "maxOperationalSpeed"
    | "maxUavDimensions"
    | "altitudeMeasurementError"
    | "gpsInaccuracy"
    | "positionError"
    | "mapError"
    | "responseTime"
  >;
  droneType: OptionType | null;
  altitudeMeasurementErrorType: DroneOperationFormState["altitudeMeasurementErrorType"];
  onDataChange: (
    valueStr: string,
    field: keyof FormDataValues,
    rules?: ValidationRule,
  ) => void;
  onDroneTypeChange: (selectedOption: OptionType | null) => void;
  onAltitudeMeasurementErrorTypeChange: (value: string) => void;
  getFieldError: (fieldName: string) => string | undefined;
};

export const UAVDetailsSection: React.FC<UAVDetailsSectionProps> = React.memo(
  ({
    data,
    droneType,
    altitudeMeasurementErrorType,
    onDataChange,
    onDroneTypeChange,
    onAltitudeMeasurementErrorTypeChange,
    getFieldError,
  }) => {
    const { form } = useTranslations();

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {form("uavDetails")}
        </h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <SelectField
            label={form("droneType")}
            value={droneType}
            onChange={onDroneTypeChange}
            options={droneTypes}
            name="droneType"
            getFieldError={getFieldError}
            required
            infoText={form("droneTypeInfo")}
          />
          <NumberInput
            label={form("maxOperationalSpeed")}
            value={data.maxOperationalSpeed ?? ""}
            onChange={(val) =>
              onDataChange(val, "maxOperationalSpeed", {
                min: 0.0001,
                custom: (v) =>
                  droneType?.value === "MULTIROTOR" && v < 3
                    ? "Speed below 3 m/s is unrealistic for multirotor"
                    : null,
              })
            }
            name="maxOperationalSpeed"
            getFieldError={getFieldError}
            required
            min={0.0001}
            step="any"
            infoText={form("maxOperationalSpeedInfo")}
          />
          <NumberInput
            label={form("maxUavDimensions")}
            value={data.maxUavDimensions ?? ""}
            onChange={(val) =>
              onDataChange(val, "maxUavDimensions", { min: 0.0001 })
            }
            name="maxUavDimensions"
            getFieldError={getFieldError}
            required
            min={0.0001}
            step="any"
            infoText={form("maxUavDimensionsInfo")}
          />
          <SelectField
            label={form("altitudeMeasurementErrorType")}
            name="altitudeMeasurementErrorType"
            value={
              altitudeOptions.find(
                (opt) => opt.value === altitudeMeasurementErrorType,
              ) || null
            }
            onChange={(selected) =>
              onAltitudeMeasurementErrorTypeChange(selected?.value ?? "")
            }
            options={altitudeOptions}
            getFieldError={getFieldError}
            required
            placeholder={form("selectAnOption")}
            infoText={form("altitudeMeasurementErrorTypeInfo")}
          />
          <NumberInput
            label={form("altitudeMeasurementError")}
            value={data.altitudeMeasurementError}
            onChange={(val) =>
              onDataChange(val, "altitudeMeasurementError", {
                min: altitudeMeasurementErrorType === "GPS-based" ? 4 : 1,
              })
            }
            name="altitudeMeasurementError"
            getFieldError={getFieldError}
            required
            min={altitudeMeasurementErrorType === "GPS-based" ? 4 : 1}
            step="any"
            infoText={form("altitudeMeasurementErrorInfo")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label={form("gpsInaccuracy")}
            value={data.gpsInaccuracy}
            onChange={(val) =>
              onDataChange(val, "gpsInaccuracy", { min: 0.0001 })
            }
            name="gpsInaccuracy"
            getFieldError={getFieldError}
            required
            min={0.0001}
            step="any"
            infoText={form("gpsInaccuracyInfo")}
          />
          <NumberInput
            label={form("positionHoldingError")}
            value={data.positionError}
            onChange={(val) => onDataChange(val, "positionError", { min: 0 })}
            name="positionError"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText={form("positionHoldingErrorInfo")}
          />
          <NumberInput
            label={form("mapError")}
            value={data.mapError}
            onChange={(val) => onDataChange(val, "mapError", { min: 0 })}
            name="mapError"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText={form("mapErrorInfo")}
          />
          <NumberInput
            label={form("responseTime")}
            value={data.responseTime}
            onChange={(val) => onDataChange(val, "responseTime", { min: 0 })}
            name="responseTime"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText={form("responseTimeInfo")}
          />
        </div>
      </div>
    );
  },
);