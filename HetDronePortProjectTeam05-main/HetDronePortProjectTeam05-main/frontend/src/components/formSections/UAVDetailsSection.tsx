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
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          UAV Details
        </h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <SelectField
            label="Drone Type"
            value={droneType}
            onChange={onDroneTypeChange}
            options={droneTypes}
            name="droneType"
            getFieldError={getFieldError}
            required
            infoText="A classification of UAV based on their design and flight characteristics."
          />
          <NumberInput
            label="Maximum operational speed (m/s)"
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
            infoText="Maximum operational speed that is flown."
          />
          <NumberInput
            label="Maximum UAV dimensions (m)"
            value={data.maxUavDimensions ?? ""}
            onChange={(val) =>
              onDataChange(val, "maxUavDimensions", { min: 0.0001 })
            }
            name="maxUavDimensions"
            getFieldError={getFieldError}
            required
            min={0.0001}
            step="any"
            infoText='The "Maximum UAV dimensions" is the maximum possible length of a straight line that can be spanned from one point on the UAV geometry to another point. Propellers and rotors are part of the geometry, whereby their most unfavorable position is considered.'
          />
          <SelectField
            label="Altitude measurement error type"
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
            placeholder="Select type"
            infoText="The nature or source of inaccuracies in altitude readings."
          />
          <NumberInput
            label="Altitude measurement error (m)"
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
            infoText="The numerical deviation between the actual altitude of the UAV and the altitude reported by its sensors or systems."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label="GPS inaccuracy (m)"
            value={data.gpsInaccuracy}
            onChange={(val) =>
              onDataChange(val, "gpsInaccuracy", { min: 0.0001 })
            }
            name="gpsInaccuracy"
            getFieldError={getFieldError}
            required
            min={0.0001}
            step="any"
            infoText="The deviation between the actual geographical position of the UAV and the position reported by its GPS system."
          />
          <NumberInput
            label="Position holding error (m)"
            value={data.positionError}
            onChange={(val) => onDataChange(val, "positionError", { min: 0 })}
            name="positionError"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText="The maximum deviation a UAV exhibits from a commanded position while attempting to hover."
          />
          <NumberInput
            label="Map error (m)"
            value={data.mapError}
            onChange={(val) => onDataChange(val, "mapError", { min: 0 })}
            name="mapError"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText="Discrepancies between real-world geography and digital map data."
          />
          <NumberInput
            label="Response time (s)"
            value={data.responseTime}
            onChange={(val) => onDataChange(val, "responseTime", { min: 0 })}
            name="responseTime"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            infoText="Time between detection of an abnormal situation and initiation of contingency response."
          />
        </div>
      </div>
    );
  },
);
