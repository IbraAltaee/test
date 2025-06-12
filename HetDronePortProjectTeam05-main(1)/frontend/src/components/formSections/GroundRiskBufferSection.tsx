"use client";

import { useTranslations } from "@/hooks/useTranslations";
import DroneOperationService from "@/services/droneOperationService";
import { FormDataValues } from "@/types/droneOperationFormState";
import { OptionType } from "@/types/optionType";
import { ValidationRule } from "@/types/validationRule";
import React from "react";
import { SingleValue } from "react-select";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";

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
      const { form, validation } = useTranslations();

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
            {form("groundRiskBuffer")}
          </h3>
          <SelectField
            label={form("methodOfTermination")}
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
            infoText={form("methodOfTerminationInfo")}
          />
          {methodOffTermination?.value === "PARACHUTE" && (
            <>
              {lateralContingencyManoeuvreValue !== "PARACHUTE_TERMINATION" &&
                verticalContingencyManoeuvreValue !==
                  "PARACHUTE_TERMINATION" && (
                  <NumberInput
                    label={form("timeToOpenParachute")}
                    value={data.grbParachuteTime ?? ""}
                    onChange={(val) =>
                      onDataChange(val, "grbParachuteTime", { min: 0 })
                    }
                    name="grbParachuteTime"
                    getFieldError={getFieldError}
                    required
                    step="any"
                    infoText={form("timeToOpenParachuteInfo")}
                  />
                )}
              <NumberInput
                label={form("maxWindSpeed")}
                value={data.windSpeed ?? ""}
                onChange={(val) =>
                  onDataChange(val, "windSpeed", {
                    min: 3,
                    custom: (v) =>
                      v < 3 ? validation("windSpeedBelow3MsNotRealistic") : null,
                  })
                }
                name="windSpeed"
                getFieldError={getFieldError}
                required
                step="any"
                helperText={form("minimum3Ms")}
                infoText={form("maxWindSpeedInfo")}
              />
              <NumberInput
                label={form("parachuteDescentRate")}
                value={data.parachuteDescent ?? ""}
                onChange={(val) =>
                  onDataChange(val, "parachuteDescent", {
                    min: 0.1,
                    custom: (v) =>
                      v <= 0 ? validation("descentRateMustBePositive") : null,
                  })
                }
                name="parachuteDescent"
                getFieldError={getFieldError}
                required
                step="any"
                infoText={form("parachuteDescentRateInfo")}
              />
            </>
          )}
          {methodOffTermination?.value === "OFF_GLIDING" && (
            <NumberInput
              label={form("glideRatio")}
              value={data.glideRatio ?? ""}
              onChange={(val) =>
                onDataChange(val, "glideRatio", { min: 0.0001 })
              }
              name="glideRatio"
              getFieldError={getFieldError}
              required
              step="any"
              infoText={form("glideRatioInfo")}
            />
          )}
        </div>
      );
    },
  );