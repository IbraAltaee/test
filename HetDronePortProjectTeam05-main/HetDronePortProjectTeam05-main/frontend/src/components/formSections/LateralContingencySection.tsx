"use client";

import React from "react";
import { SingleValue } from "react-select";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { FormDataValues } from "@/types/droneOperationFormState";
import { ValidationRule } from "@/types/validationRule";
import DroneOperationService from "@/services/droneOperationService";

type LateralContingencySectionProps = {
  data: Pick<
    FormDataValues,
    "rollAngle" | "pitchAngle" | "lateralParachuteTime"
  >;
  droneType: OptionType | null;
  lateralContingencyManoeuvre: OptionType | null;
  onDataChange: (
    valueStr: string,
    field: keyof Pick<
      FormDataValues,
      "rollAngle" | "pitchAngle" | "lateralParachuteTime"
    >,
    rules?: ValidationRule,
  ) => void;
  onManoeuvreChange: (selectedOption: SingleValue<OptionType>) => void;
  getFieldError: (fieldName: string) => string | undefined;
};

export const LateralContingencySection: React.FC<LateralContingencySectionProps> =
  React.memo(
    ({
      data,
      droneType,
      lateralContingencyManoeuvre,
      onDataChange,
      onManoeuvreChange,
      getFieldError,
    }) => {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Lateral Contingency Volume
          </h3>
          <SelectField
            label="Contingency manoeuvre"
            value={lateralContingencyManoeuvre}
            onChange={onManoeuvreChange}
            options={DroneOperationService.getLateralContingencyManoeuvres(
              droneType,
            )}
            name="lateralContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText="Predefined flight action upon exiting intended flight geography."
          />
          {lateralContingencyManoeuvre?.value === "TURN_180" && (
            <NumberInput
              label="Roll angle (°)"
              value={data.rollAngle}
              onChange={(val) =>
                onDataChange(val, "rollAngle", { min: 1, max: 90 })
              }
              name="rollAngle"
              getFieldError={getFieldError}
              required
              min={1}
              max={90}
              step="any"
              helperText="Default: 30°"
              infoText="Angle of tilt for turning."
            />
          )}
          {lateralContingencyManoeuvre?.value === "STOPPING" && (
            <NumberInput
              label="Pitch angle (°)"
              value={data.pitchAngle}
              onChange={(val) =>
                onDataChange(val, "pitchAngle", { min: 1, max: 90 })
              }
              name="pitchAngle"
              getFieldError={getFieldError}
              required
              min={1}
              max={90}
              step="any"
              helperText="Default: 45°"
              infoText="Angle of nose tilt for ascent/descent."
            />
          )}
          {lateralContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" && (
            <NumberInput
              label="Time to open parachute (s)"
              value={data.lateralParachuteTime ?? ""}
              onChange={(val) =>
                onDataChange(val, "lateralParachuteTime", { min: 0 })
              }
              name="lateralParachuteTime"
              getFieldError={getFieldError}
              required
              min={0}
              step="any"
              infoText="Duration for parachute full deployment."
            />
          )}
        </div>
      );
    },
  );
