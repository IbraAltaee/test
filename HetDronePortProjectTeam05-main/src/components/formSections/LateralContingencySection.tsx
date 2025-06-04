"use client";

import React from "react";
import { SingleValue } from "react-select";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { FormDataValues } from "@/types/droneOperationFormState";
import { ValidationRule } from "@/types/validationRule";
import DroneOperationService from "@/services/droneOperationService";
import { useTranslations } from "@/hooks/useTranslations";

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
      const { form } = useTranslations();

      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {form("lateralContingencyVolume")}
          </h3>
          <SelectField
            label={form("contingencyManoeuvre")}
            value={lateralContingencyManoeuvre}
            onChange={onManoeuvreChange}
            options={DroneOperationService.getLateralContingencyManoeuvres(
              droneType,
            )}
            name="lateralContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText={form("contingencyManoeuvreInfo")}
          />
          {lateralContingencyManoeuvre?.value === "TURN_180" && (
            <NumberInput
              label={form("rollAngle")}
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
              helperText={form("default30Degrees")}
              infoText={form("rollAngleInfo")}
            />
          )}
          {lateralContingencyManoeuvre?.value === "STOPPING" && (
            <NumberInput
              label={form("pitchAngle")}
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
              helperText={form("default45Degrees")}
              infoText={form("pitchAngleInfo")}
            />
          )}
          {lateralContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" && (
            <NumberInput
              label={form("timeToOpenParachute")}
              value={data.lateralParachuteTime ?? ""}
              onChange={(val) =>
                onDataChange(val, "lateralParachuteTime", { min: 0 })
              }
              name="lateralParachuteTime"
              getFieldError={getFieldError}
              required
              min={0}
              step="any"
              infoText={form("timeToOpenParachuteInfo")}
            />
          )}
        </div>
      );
    },
  );