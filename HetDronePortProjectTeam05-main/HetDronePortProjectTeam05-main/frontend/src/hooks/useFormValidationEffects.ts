"use client";

import { useEffect } from "react";
import { OptionType } from "@/types/optionType";
import { FieldError } from "@/types/fieldError";
import { FormDataValues } from "@/types/droneOperationFormState";

type UseFormValidationEffectsProps = {
  droneType: OptionType | null;
  lateralContingencyManoeuvre: OptionType | null;
  methodOffTermination: OptionType | null;
  data: Pick<
    FormDataValues,
    "maxUavDimensions" | "heightFlight" | "heightFlightFt"
  >;
  setErrors: React.Dispatch<React.SetStateAction<FieldError[]>>;
};

export const useFormValidationEffects = ({
  droneType,
  lateralContingencyManoeuvre,
  methodOffTermination,
  data,
  setErrors,
}: UseFormValidationEffectsProps) => {
  // Validation: Drone Type / Lateral Manoeuvre Conflict
  useEffect(() => {
    const fieldName = "lateralContingencyManoeuvre";
    let message: string | undefined;
    if (droneType && lateralContingencyManoeuvre) {
      if (
        droneType.value === "MULTIROTOR" &&
        lateralContingencyManoeuvre.value === "TURN_180"
      ) {
        message = "TURN_180 manoeuvre not suitable for multirotors";
      } else if (
        droneType.value === "FIXEDWING" &&
        lateralContingencyManoeuvre.value === "STOPPING"
      ) {
        message = "STOPPING manoeuvre not suitable for fixed-wing aircraft";
      }
    }
    setErrors((prev) => {
      const otherErrors = prev.filter(
        (e) =>
          e.field !== fieldName ||
          (e.message !== "TURN_180 manoeuvre not suitable for multirotors" &&
            e.message !==
              "STOPPING manoeuvre not suitable for fixed-wing aircraft"),
      );
      if (
        message &&
        !otherErrors.some((e) => e.field === fieldName && e.message === message)
      ) {
        return [...otherErrors, { field: fieldName, message }];
      }
      if (
        !message &&
        prev.some(
          (e) =>
            e.field === fieldName &&
            (e.message === "TURN_180 manoeuvre not suitable for multirotors" ||
              e.message ===
                "STOPPING manoeuvre not suitable for fixed-wing aircraft"),
        )
      ) {
        return otherErrors;
      }
      return prev;
    });
  }, [droneType, lateralContingencyManoeuvre, setErrors]);

  useEffect(() => {
    const fieldName = "methodOffTermination";
    let message: string | undefined;
    if (droneType && methodOffTermination) {
      if (
        droneType.value === "FIXEDWING" &&
        methodOffTermination.value === "BALLISTIC_APPROACH"
      ) {
        message =
          "Ballistic approach only allowed for multirotors and rotorcrafts";
      }
    }
    setErrors((prev) => {
      const otherErrors = prev.filter(
        (e) =>
          e.field !== fieldName ||
          e.message !==
            "Ballistic approach only allowed for multirotors and rotorcrafts",
      );
      if (
        message &&
        !otherErrors.some((e) => e.field === fieldName && e.message === message)
      ) {
        return [...otherErrors, { field: fieldName, message }];
      }
      if (
        !message &&
        prev.some(
          (e) =>
            e.field === fieldName &&
            e.message ===
              "Ballistic approach only allowed for multirotors and rotorcrafts",
        )
      ) {
        return otherErrors;
      }
      return prev;
    });
  }, [droneType, methodOffTermination, setErrors]);

  useEffect(() => {
    const { maxUavDimensions, heightFlight } = data;
    const fieldName = "heightFlight";
    const ruleSpecificErrorPrefix = "Height must be at least 3×";
    let newMessage: string | null = null;
    if (
      typeof maxUavDimensions === "number" &&
      typeof heightFlight === "number" &&
      heightFlight < 3 * maxUavDimensions
    ) {
      newMessage = `Height must be at least 3× Max UAV Dimensions (${(3 * maxUavDimensions).toFixed(2)}m)`;
    }
    setErrors((prevErrors) => {
      const existingRuleError = prevErrors.find(
        (e) =>
          e.field === fieldName &&
          e.message.startsWith(ruleSpecificErrorPrefix),
      );
      const otherErrorsOnField = prevErrors.filter(
        (e) =>
          e.field === fieldName &&
          !e.message.startsWith(ruleSpecificErrorPrefix),
      );
      const errorsForOtherFields = prevErrors.filter(
        (e) => e.field !== fieldName,
      );
      if (newMessage) {
        if (existingRuleError && existingRuleError.message === newMessage)
          return prevErrors;
        return [
          ...errorsForOtherFields,
          ...otherErrorsOnField,
          { field: fieldName, message: newMessage },
        ];
      } else {
        if (existingRuleError)
          return [...errorsForOtherFields, ...otherErrorsOnField];
        return prevErrors;
      }
    });
  }, [data.maxUavDimensions, data.heightFlight, setErrors]);

  // Validation: Height vs Max UAV Dimensions (Feet)
  useEffect(() => {
    const { maxUavDimensions, heightFlightFt } = data;
    const fieldName = "heightFlightFt";
    const ruleSpecificErrorPrefix = "Height must be at least 3x";
    let newMessage: string | null = null;
    if (
      typeof maxUavDimensions === "number" &&
      typeof heightFlightFt === "number" &&
      heightFlightFt < (3 * maxUavDimensions) / 0.3048
    ) {
      newMessage = `Height must be at least 3x Max UAV Dimensions (${((3 * maxUavDimensions) / 0.3048).toFixed(2)}ft)`;
    }
    setErrors((prevErrors) => {
      const existingRuleError = prevErrors.find(
        (e) =>
          e.field === fieldName &&
          e.message.startsWith(ruleSpecificErrorPrefix),
      );
      const otherErrorsOnField = prevErrors.filter(
        (e) =>
          e.field === fieldName &&
          !e.message.startsWith(ruleSpecificErrorPrefix),
      );
      const errorsForOtherFields = prevErrors.filter(
        (e) => e.field !== fieldName,
      );
      if (newMessage) {
        if (existingRuleError && existingRuleError.message === newMessage)
          return prevErrors;
        return [
          ...errorsForOtherFields,
          ...otherErrorsOnField,
          { field: fieldName, message: newMessage },
        ];
      } else {
        if (existingRuleError)
          return [...errorsForOtherFields, ...otherErrorsOnField];
        return prevErrors;
      }
    });
  }, [data.maxUavDimensions, data.heightFlightFt, setErrors]);
};
