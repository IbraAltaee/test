"use client";

import React from "react";
import { SingleValue } from "react-select";
import { NumberInput } from "../inputField";
import { SelectField } from "../selectField";
import { OptionType } from "@/types/optionType";
import { FormDataValues } from "@/types/droneOperationFormState";
import { ValidationRule } from "@/types/validationRule";
import DroneOperationService from "@/services/droneOperationService";

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
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Vertical Contingency Volume
          </h3>
          <NumberInput
            label="Response height (m)"
            value={data.responseHeight ?? ""}
            onChange={(val) => onDataChange(val, "responseHeight", { min: 0 })}
            name="responseHeight"
            getFieldError={getFieldError}
            required
            min={0}
            step="any"
            helperText="Calculated from max speed & response time. Change with caution."
            infoText="Altitude range for effective contingency manoeuvres."
          />
          <SelectField
            label="Contingency manoeuvre"
            value={verticalContingencyManoeuvre}
            onChange={onManoeuvreChange}
            options={DroneOperationService.getVerticalContingencyManoeuvres(
              droneType,
            )}
            name="verticalContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText="Manoeuvre for vertical contingency."
          />
          {verticalContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
            lateralContingencyManoeuvreValue !== "PARACHUTE_TERMINATION" && (
              <NumberInput
                label="Time to open parachute (s)"
                value={data.verticalParachuteTime ?? ""}
                onChange={(val) =>
                  onDataChange(val, "verticalParachuteTime", { min: 0 })
                }
                name="verticalParachuteTime"
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
