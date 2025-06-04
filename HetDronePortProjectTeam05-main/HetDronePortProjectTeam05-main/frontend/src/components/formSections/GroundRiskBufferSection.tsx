"use client";

import React from "react";
import { SingleValue } from "react-select";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { FormDataValues } from "@/types/droneOperationFormState";
import { ValidationRule } from "@/types/validationRule";
import DroneOperationService from "@/services/droneOperationService";

type GroundRiskBufferSectionProps = {
  data: Pick<
    FormDataValues,
    "grbParachuteTime" | "windSpeed" | "parachuteDescent" | "glideRatio"
  >;
  droneType: OptionType | null;
  lateralContingencyManoeuvreValue?: string | null;
  verticalContingencyManoeuvreValue?: string | null;
  methodOffTermination: OptionType | null;
  onDataChange: (
    valueStr: string,
    field: keyof Pick<
      FormDataValues,
      "grbParachuteTime" | "windSpeed" | "parachuteDescent" | "glideRatio"
    >,
    rules?: ValidationRule,
  ) => void;
  onMethodChange: (selectedOption: SingleValue<OptionType>) => void;
  getFieldError: (fieldName: string) => string | undefined;
};

export const GroundRiskBufferSection: React.FC<GroundRiskBufferSectionProps> =
  React.memo(
    ({
      data,
      droneType,
      lateralContingencyManoeuvreValue,
      verticalContingencyManoeuvreValue,
      methodOffTermination,
      onDataChange,
      onMethodChange,
      getFieldError,
    }) => {
      const lateralManoeuvreOption = lateralContingencyManoeuvreValue
        ? DroneOperationService.getLateralContingencyManoeuvres(droneType).find(
            (o) => o.value === lateralContingencyManoeuvreValue,
          ) || null
        : null;
      const verticalManoeuvreOption = verticalContingencyManoeuvreValue
        ? DroneOperationService.getVerticalContingencyManoeuvres(
            droneType,
          ).find((o) => o.value === verticalContingencyManoeuvreValue) || null
        : null;

      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Ground Risk Buffer
          </h3>
          <SelectField
            label="Method of termination"
            value={methodOffTermination}
            onChange={onMethodChange}
            options={DroneOperationService.getMethodOfTermination(
              droneType,
              lateralManoeuvreOption,
              verticalManoeuvreOption,
            )}
            name="methodOffTermination"
            getFieldError={getFieldError}
            required
            infoText="Technique to bring an uncontrolled UAV to the ground."
          />
          {methodOffTermination?.value === "PARACHUTE" && (
            <>
              {lateralContingencyManoeuvreValue !== "PARACHUTE_TERMINATION" &&
                verticalContingencyManoeuvreValue !==
                  "PARACHUTE_TERMINATION" && (
                  <NumberInput
                    label="Time to open parachute (s)"
                    value={data.grbParachuteTime ?? ""}
                    onChange={(val) =>
                      onDataChange(val, "grbParachuteTime", { min: 0 })
                    }
                    name="grbParachuteTime"
                    getFieldError={getFieldError}
                    required
                    min={0}
                    step="any"
                    infoText="Duration for parachute full deployment."
                  />
                )}
              <NumberInput
                label="Max wind speed (m/s)"
                value={data.windSpeed ?? ""}
                onChange={(val) =>
                  onDataChange(val, "windSpeed", {
                    min: 3,
                    custom: (v) =>
                      v < 3 ? "Wind speed below 3 m/s is not realistic" : null,
                  })
                }
                name="windSpeed"
                getFieldError={getFieldError}
                required
                min={3}
                step="any"
                helperText="Minimum 3 m/s"
                infoText="Maximum wind speed for operation."
              />
              <NumberInput
                label="Parachute descent rate (m/s)"
                value={data.parachuteDescent ?? ""}
                onChange={(val) =>
                  onDataChange(val, "parachuteDescent", {
                    min: 0.1,
                    custom: (v) =>
                      v <= 0 ? "Descent rate must be positive" : null,
                  })
                }
                name="parachuteDescent"
                getFieldError={getFieldError}
                required
                min={0.1}
                step="any"
                infoText="Speed of descent after parachute deployment."
              />
            </>
          )}
          {methodOffTermination?.value === "OFF_GLIDING" && (
            <NumberInput
              label="Glide ratio"
              value={data.glideRatio ?? ""}
              onChange={(val) =>
                onDataChange(val, "glideRatio", { min: 0.0001 })
              }
              name="glideRatio"
              getFieldError={getFieldError}
              required
              min={0.0001}
              step="any"
              infoText="Horizontal distance traveled per unit of vertical descent without propulsion."
            />
          )}
        </div>
      );
    },
  );
