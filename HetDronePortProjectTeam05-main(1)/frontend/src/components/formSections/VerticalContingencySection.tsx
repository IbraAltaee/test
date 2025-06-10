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

type VerticalContingencySectionProps = {
  data: Pick<FormDataValues, "responseHeight" | "verticalParachuteTime">;
  droneType: OptionType | null;
  verticalContingencyManoeuvre: OptionType | null;
  lateralContingencyManoeuvreValue?: string | null;
  onDataChange: (
    valueStr: string,
    field: keyof Pick<
      FormDataValues,
      "responseHeight" | "verticalParachuteTime"
    >,
    rules?: ValidationRule,
  ) => void;
  onManoeuvreChange: (selectedOption: SingleValue<OptionType>) => void;
  getFieldError: (fieldName: string) => string | undefined;
};

export const VerticalContingencySection: React.FC<VerticalContingencySectionProps> =
  React.memo(
    ({
      data,
      droneType,
      verticalContingencyManoeuvre,
      lateralContingencyManoeuvreValue,
      onDataChange,
      onManoeuvreChange,
      getFieldError,
    }) => {
      const { form } = useTranslations();

      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {form("verticalContingencyVolume")}
          </h3>
          <NumberInput
            label={form("responseHeight")}
            value={data.responseHeight ?? ""}
            onChange={(val) => onDataChange(val, "responseHeight", { min: 0 })}
            name="responseHeight"
            getFieldError={getFieldError}
            required
            step="any"
            helperText={form("responseHeightHelper")}
            infoText={form("responseHeightInfo")}
          />
          <SelectField
            label={form("contingencyManoeuvre")}
            value={verticalContingencyManoeuvre}
            onChange={onManoeuvreChange}
            options={DroneOperationService.getVerticalContingencyManoeuvres(
              droneType,
            )}
            name="verticalContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText={form("contingencyManoeuvreInfo")}
          />
          {verticalContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
            lateralContingencyManoeuvreValue !== "PARACHUTE_TERMINATION" && (
              <NumberInput
                label={form("timeToOpenParachute")}
                value={data.verticalParachuteTime ?? ""}
                onChange={(val) =>
                  onDataChange(val, "verticalParachuteTime", { min: 0 })
                }
                name="verticalParachuteTime"
                getFieldError={getFieldError}
                required
                step="any"
                infoText={form("timeToOpenParachuteInfo")}
              />
            )}
        </div>
      );
    },
  );