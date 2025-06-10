"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { SingleValue } from "react-select";

import DroneOperationService from "@/services/droneOperationService";
import ValidationService from "@/services/validationService";
import { OptionType } from "@/types/optionType";
import { FieldError } from "@/types/fieldError";
import {
  FormDataValues,
  initialDataValues,
} from "@/types/droneOperationFormState";
import { ValidationRule } from "@/types/validationRule";
import { useFormHashComparison } from "@/utils/useFormHashComparison";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks/useTranslations";

import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useFormValidationEffects } from "@/hooks/useFormValidationEffects";
import { useDroneAndFormManagement } from "@/hooks/useDroneAndFormManagement";

import { UAVDetailsSection } from "./formSections/UAVDetailsSection";
import { FlightGeographySection } from "./formSections/FlightGeographySection";
import { LateralContingencySection } from "./formSections/LateralContingencySection";
import { VerticalContingencySection } from "./formSections/VerticalContingencySection";
import { GroundRiskBufferSection } from "./formSections/GroundRiskBufferSection";
import { CombinedConfigurationSection } from "./formSections/CombinedConfigurationSection";

type InputFormProps = {
  onCalculate: (response: any) => void;
  onHeightChange: (height: number) => void;
  maxHeightError?: string;
};

const InputForm: React.FC<InputFormProps> = ({
  onCalculate,
  onHeightChange,
  maxHeightError,
}) => {
  const [droneType, setDroneType] = useState<OptionType | null>(null);
  const [lateralContingencyManoeuvre, setLateralContingencyManoeuvre] =
    useState<OptionType | null>(null);
  const [verticalContingencyManoeuvre, setVerticalContingencyManoeuvre] =
    useState<OptionType | null>(null);
  const [methodOffTermination, setMethodOffTermination] =
    useState<OptionType | null>(null);
  const [altitudeMeasurementErrorType, setAltitudeMeasurementErrorType] =
    useState<"barometric" | "GPS-based" | null>(null);

  const [data, setData] = useState<FormDataValues>(initialDataValues);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { username } = useAuth();
  const { form, notifications, validation, tooltips } = useTranslations();

  const {
    isRecaptchaVerified,
    recaptchaToken,
    recaptchaRef,
    showRecaptcha,
    setShowRecaptcha,
    handleRecaptchaVerify,
    resetRecaptcha,
    handleRecaptchaExpired,
    handleRecaptchaError,
  } = useRecaptcha();

  const buildFormState = useCallback(
    (): {
      droneType: string | null;
      lateralContingencyManoeuvre: string | null;
      verticalContingencyManoeuvre: string | null;
      methodOffTermination: string | null;
      altitudeMeasurementErrorType: "barometric" | "GPS-based" | null;
      maxOperationalSpeed?: number;
      maxUavDimensions?: number;
      altitudeMeasurementError: number;
      gpsInaccuracy: number;
      positionError: number;
      mapError: number;
      responseTime: number;
      heightFlight?: number;
      heightFlightFt?: number;
      rollAngle: number;
      pitchAngle: number;
      lateralParachuteTime?: number;
      responseHeight?: number;
      verticalParachuteTime?: number;
      grbParachuteTime?: number;
      windSpeed?: number;
      parachuteDescent?: number;
      glideRatio?: number;
      name: string | null;
    } => ({
      droneType: droneType?.value || null,
      lateralContingencyManoeuvre: lateralContingencyManoeuvre?.value || null,
      verticalContingencyManoeuvre: verticalContingencyManoeuvre?.value || null,
      methodOffTermination: methodOffTermination?.value || null,
      altitudeMeasurementErrorType,
      ...data,
      name: droneOps.configName,
    }),
    [
      droneType,
      lateralContingencyManoeuvre,
      verticalContingencyManoeuvre,
      methodOffTermination,
      altitudeMeasurementErrorType,
      data,
    ],
  );

  const isInputValid = useCallback(
    (isExport: boolean) => {
      const translateValidation = (key: string, params?: Record<string, any>) => {
        return validation(key.replace('validation.', ''), params);
      };

      return ValidationService.validateFormForJSON(
        {
          droneType,
          maxOperationalSpeed: data.maxOperationalSpeed,
          maxUavDimensions: data.maxUavDimensions,
          altitudeMeasurementErrorType,
          lateralContingencyManoeuvre,
          verticalContingencyManoeuvre,
          methodOffTermination,
          heightFlight: data.heightFlight,
          lateralParachuteTime: data.lateralParachuteTime,
          verticalParachuteTime: data.verticalParachuteTime,
          grbParachuteTime: data.grbParachuteTime,
          windSpeed: data.windSpeed,
          parachuteDescent: data.parachuteDescent,
          glideRatio: data.glideRatio,
          isExport: isExport,
        },
        (newErrors) => setErrors(newErrors),
        translateValidation,
      );
    },
    [
      droneType,
      data,
      altitudeMeasurementErrorType,
      lateralContingencyManoeuvre,
      verticalContingencyManoeuvre,
      methodOffTermination,
      validation,
    ],
  );

  const droneOps = useDroneAndFormManagement({
    setFormErrors: setErrors,
    setDroneTypeState: setDroneType,
    setLateralContingencyManoeuvreState: setLateralContingencyManoeuvre,
    setVerticalContingencyManoeuvreState: setVerticalContingencyManoeuvre,
    setMethodOffTerminationState: setMethodOffTermination,
    setAltitudeMeasurementErrorTypeState: setAltitudeMeasurementErrorType,
    setFormDataState: setData,
    isFormInputValid: isInputValid,
    buildFormStateObject: buildFormState,
  });

  useFormValidationEffects({
    droneType,
    lateralContingencyManoeuvre,
    methodOffTermination,
    data: {
      maxUavDimensions: data.maxUavDimensions,
      heightFlight: data.heightFlight,
      heightFlightFt: data.heightFlightFt,
    },
    setErrors,
  });

  const getFieldError = useCallback(
    (fieldName: string): string | undefined =>
      errors.find((e) => e.field === fieldName)?.message,
    [errors],
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => prev.filter((e) => e.field !== fieldName));
  }, []);

  useEffect(() => {
    if (
      data.maxOperationalSpeed !== undefined &&
      data.responseTime !== undefined
    ) {
      const value = Number(
        (data.maxOperationalSpeed * 0.7 * data.responseTime).toFixed(2),
      );
      setData((prev) =>
        prev.responseHeight === value
          ? prev
          : { ...prev, responseHeight: value },
      );
    } else {
      setData((prev) =>
        prev.responseHeight === undefined
          ? prev
          : { ...prev, responseHeight: undefined },
      );
    }
  }, [data.maxOperationalSpeed, data.responseTime]);

  useEffect(() => {
    if (data.heightFlight !== undefined) onHeightChange(data.heightFlight);
  }, [data.heightFlight, onHeightChange]);

  const handleDataChange = useCallback(
    (valueStr: string, field: keyof FormDataValues, rules?: ValidationRule) => {
      const parsed = parseFloat(valueStr);
      let error: string | null = null;
      if (isNaN(parsed)) {
        error = validation("valueMustBeNumber");
      } else if (rules) {
        if (rules.min !== undefined && parsed < rules.min)
          error = validation("valueMustBeAtLeast", { min: rules.min });
        else if (rules.max !== undefined && parsed > rules.max)
          error = validation("valueMustBeAtMost", { max: rules.max });
        else if (rules.custom) error = rules.custom(parsed);
      }
      setErrors((prev) => {
        const otherErrors = prev.filter(
          (e) =>
            e.field !== String(field) ||
            ((e.message.includes("Height must be at least 3×") ||
              e.message.includes("Height must be at least 3x")) &&
              field.toString().startsWith("heightFlight")),
        );
        if (error)
          return [...otherErrors, { field: String(field), message: error }];
        return otherErrors;
      });
      setData((prevData) => {
        const newFieldValue = isNaN(parsed) ? undefined : parsed;
        if (
          prevData[field] === newFieldValue &&
          !(isNaN(parsed) && prevData[field] === undefined)
        )
          return prevData;
        return { ...prevData, [field]: newFieldValue };
      });
    },
    [setErrors, setData, validation],
  );

  const handleDroneTypeChange = useCallback(
    (selectedOption: OptionType | null) => {
      setDroneType(selectedOption);
      setLateralContingencyManoeuvre(null);
      setVerticalContingencyManoeuvre(null);
      setMethodOffTermination(null);
      clearFieldError("droneType");
      if (data.maxOperationalSpeed !== undefined) {
        handleDataChange(
          String(data.maxOperationalSpeed),
          "maxOperationalSpeed",
          {
            min: 0.0001,
            custom: (v) =>
              selectedOption?.value === "MULTIROTOR" && v < 3
                ? validation("speedBelow3MsUnrealistic")
                : null,
          },
        );
      }
    },
    [clearFieldError, data.maxOperationalSpeed, handleDataChange, validation],
  );

  const handleLateralContingencyManoeuvreChange = useCallback(
    (selectedOption: SingleValue<OptionType>) => {
      setLateralContingencyManoeuvre(selectedOption);
      if (selectedOption?.value !== "PARACHUTE_TERMINATION") {
        setData((prev) => ({ ...prev, lateralParachuteTime: undefined }));
      }
      setMethodOffTermination(null);
      clearFieldError("lateralContingencyManoeuvre");
    },
    [clearFieldError, setData],
  );

  const handleVerticalContingencyManoeuvreChange = useCallback(
    (selectedOption: SingleValue<OptionType>) => {
      setVerticalContingencyManoeuvre(selectedOption);
      if (selectedOption?.value !== "PARACHUTE_TERMINATION") {
        setData((prev) => ({ ...prev, verticalParachuteTime: undefined }));
      }
      setMethodOffTermination(null);
      clearFieldError("verticalContingencyManoeuvre");
    },
    [clearFieldError, setData],
  );

  const handleMethodOffTerminationChange = useCallback(
    (selectedOption: SingleValue<OptionType>) => {
      setMethodOffTermination(selectedOption);
      if (selectedOption?.value !== "PARACHUTE") {
        setData((prev) => ({
          ...prev,
          grbParachuteTime: undefined,
          windSpeed: undefined,
          parachuteDescent: undefined,
        }));
      }
      if (selectedOption?.value !== "OFF_GLIDING") {
        setData((prev) => ({ ...prev, glideRatio: undefined }));
      }
      clearFieldError("methodOffTermination");
      if (
        data.windSpeed !== undefined &&
        selectedOption?.value === "PARACHUTE"
      ) {
        handleDataChange(String(data.windSpeed), "windSpeed", {
          min: 3,
          custom: (v) =>
            v < 3 ? validation("windSpeedBelow3MsNotRealistic") : null,
        });
      }
      if (
        data.grbParachuteTime !== undefined &&
        selectedOption?.value === "PARACHUTE"
      ) {
        handleDataChange(String(data.grbParachuteTime), "grbParachuteTime", {
          min: 0,
        });
      }
    },
    [
      clearFieldError,
      data.windSpeed,
      data.grbParachuteTime,
      handleDataChange,
      setData,
      validation,
    ],
  );

  const handleAltitudeMeasurementErrorTypeChange = useCallback(
    (value: string) => {
      const type = value as "barometric" | "GPS-based";
      setAltitudeMeasurementErrorType(type);
      const newErrorValue = type === "barometric" ? 1 : 4;
      setData((prev) => ({ ...prev, altitudeMeasurementError: newErrorValue }));
      handleDataChange(String(newErrorValue), "altitudeMeasurementError", {
        min: newErrorValue,
      });
      clearFieldError("altitudeMeasurementErrorType");
    },
    [handleDataChange, clearFieldError, setData],
  );

  const handleFlightHeightChange = useCallback(
    (valStr: string) => {
      handleDataChange(valStr, "heightFlight", { min: 0.01 });
      const parsedMeters = parseFloat(valStr);
      setData((prev) => {
        const newHeightFt = !isNaN(parsedMeters)
          ? Number((parsedMeters / 0.3048).toFixed(2))
          : undefined;
        if (
          prev.heightFlightFt === newHeightFt &&
          prev.heightFlight === parsedMeters
        )
          return prev;
        if (
          prev.heightFlightFt === newHeightFt &&
          isNaN(parsedMeters) &&
          prev.heightFlight === undefined
        )
          return prev;
        return { ...prev, heightFlightFt: newHeightFt };
      });
      clearFieldError("heightFlightFt");
    },
    [handleDataChange, clearFieldError, setData],
  );

  const handleFlightHeightFtChange = useCallback(
    (valStr: string) => {
      handleDataChange(valStr, "heightFlightFt", { min: 0.01 });
      const parsedFeet = parseFloat(valStr);
      setData((prev) => {
        const newHeight = !isNaN(parsedFeet)
          ? Number((parsedFeet * 0.3048).toFixed(2))
          : undefined;
        if (
          prev.heightFlight === newHeight &&
          prev.heightFlightFt === parsedFeet
        )
          return prev;
        if (
          prev.heightFlight === newHeight &&
          isNaN(parsedFeet) &&
          prev.heightFlightFt === undefined
        )
          return prev;
        return { ...prev, heightFlight: newHeight };
      });
      clearFieldError("heightFlight");
    },
    [handleDataChange, clearFieldError, setData],
  );

  const { isFormChanged, markFormAsSubmitted, hasLastSubmission } =
    useFormHashComparison();
  const currentFormState = useMemo(() => buildFormState(), [buildFormState]);
  const hasFormChanged = useMemo(
    () => isFormChanged(currentFormState),
    [isFormChanged, currentFormState],
  );

  const submitFormData = useCallback(async () => {
    const currentFullFormState = buildFormState();
    if (!DroneOperationService.validateRequiredFields(currentFullFormState)) {
      toast.error(validation("fillRequiredFields"));
      return;
    }
    setLoading(true);
    const apiFormData =
      DroneOperationService.buildFormData(currentFullFormState);
    try {
      const response = await DroneOperationService.calculateDroneOperation(
        apiFormData,
        recaptchaToken,
      );
      markFormAsSubmitted(currentFullFormState);
      onCalculate(response);
      toast.success(notifications("droneOperationCalculatedSuccessfully"));
    } catch (error: any) {
      console.error("Error:", error);
      if (error.requiresRecaptcha) {
        if (error.recaptchaExpired) {
          resetRecaptcha();
          toast.error(notifications("recaptchaExpiredVerifyAgain"));
        } else {
          setShowRecaptcha(true);
          toast.error(
            error.error || notifications("pleaseCompleteRecaptcha"),
          );
        }
      } else {
        toast.error(error.error || error.message || notifications("calculationFailed"));
      }
    } finally {
      setLoading(false);
    }
  }, [
    buildFormState,
    recaptchaToken,
    markFormAsSubmitted,
    onCalculate,
    resetRecaptcha,
    setShowRecaptcha,
    validation,
    notifications,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isInputValid(true)) {
        toast.error(validation("correctErrorsInForm"));
        return;
      }
      if (!hasFormChanged && hasLastSubmission) {
        toast.info(tooltips("formDataIdentical"));
        return;
      }
      await submitFormData();
    },
    [isInputValid, hasFormChanged, hasLastSubmission, submitFormData, validation, tooltips],
  );

  return (
    <div className="bg-white rounded-lg shadow-md m-4 text-gray-800 w-full max-w-2xl border border-gray-200">
      {/* Form Header */}
      <div className="border-b border-gray-200 p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-700">
          {form("droneOperationCalculator")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {form("configureUavParameters")}
        </p>
      </div>

      {/* Scrollable Form Content */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 overflow-y-scroll max-h-[70vh] p-6 scrollbar scrollbar-thumb-slate-600
    [&::-webkit-scrollbar-track]:hidden
    [&::-webkit-scrollbar-button]:hidden
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar]:w-2"
      >
        {/* Combined Configuration Section - only show if there are drones OR always show for import/export */}
        <CombinedConfigurationSection
          // Import/Export props
          onImportClick={droneOps.handleImportClick}
          fileInputRef={droneOps.fileInputRef as React.RefObject<HTMLInputElement>}
          onFileChange={droneOps.handleFileChange}
          isProcessing={droneOps.isProcessing}

          // Drone loading props
          availableDrones={droneOps.availableDrones}
          selectedDroneOption={droneOps.selectedDroneOption}
          onSelectedDroneChange={droneOps.setSelectedDroneOption}
          onLoad={droneOps.handleLoadSelectedDrone}
        />

        {username && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {form("generalInformation")}
            </h3>
            <label
              htmlFor="configName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              {form("configurationName")}
            </label>
            <input
              id="configName"
              type="text"
              value={droneOps.configName || ""}
              onChange={(e) => {
                const exists = droneOps.availableDrones.some(item => item.value === e.target.value);
                if (exists) {
                  const field = "configName"
                  const error = "Configuration name is already in use."
                  setErrors((prev) => {
                    const otherErrors = prev.filter(
                      (e) =>
                        e.field !== String(field) ||
                        ((e.message.startsWith("Height must be at least 3×") ||
                          e.message.startsWith("Height must be at least 3x")) &&
                          field.toString().startsWith("heightFlight")),
                    );
                    if (error)
                      return [...otherErrors, { field: String(field), message: error }];
                    return otherErrors;
                  });
                  droneOps.setConfigName(e.target.value)
                  return;
                }
                clearFieldError("configName")
                droneOps.setConfigName(e.target.value)
              }}
              className={`w-full p-2 border border-gray-300 rounded-lg mb-4 ${getFieldError("configName") ? "border-red-500" : ""}`}
              name="configName"
            />
            {getFieldError("configName") && (
              <p className="text-xs text-red-500 mt-1">
                {getFieldError("configName")}
              </p>
            )}
          </div>
        )}

        <UAVDetailsSection
          data={data}
          droneType={droneType}
          altitudeMeasurementErrorType={altitudeMeasurementErrorType}
          onDataChange={handleDataChange}
          onDroneTypeChange={handleDroneTypeChange}
          onAltitudeMeasurementErrorTypeChange={
            handleAltitudeMeasurementErrorTypeChange
          }
          getFieldError={getFieldError}
        />
        <FlightGeographySection
          data={data}
          maxHeightError={maxHeightError}
          onHeightFlightChange={handleFlightHeightChange}
          onHeightFlightFtChange={handleFlightHeightFtChange}
          getFieldError={getFieldError}
        />
        <LateralContingencySection
          data={data}
          droneType={droneType}
          lateralContingencyManoeuvre={lateralContingencyManoeuvre}
          onDataChange={handleDataChange}
          onManoeuvreChange={handleLateralContingencyManoeuvreChange}
          getFieldError={getFieldError}
        />
        <VerticalContingencySection
          data={data}
          droneType={droneType}
          verticalContingencyManoeuvre={verticalContingencyManoeuvre}
          lateralContingencyManoeuvreValue={lateralContingencyManoeuvre?.value}
          onDataChange={handleDataChange}
          onManoeuvreChange={handleVerticalContingencyManoeuvreChange}
          getFieldError={getFieldError}
        />
        <GroundRiskBufferSection
          data={data}
          droneType={droneType}
          lateralContingencyManoeuvreValue={lateralContingencyManoeuvre?.value}
          verticalContingencyManoeuvreValue={verticalContingencyManoeuvre?.value}
          methodOffTermination={methodOffTermination}
          onDataChange={handleDataChange}
          onMethodChange={handleMethodOffTerminationChange}
          getFieldError={getFieldError}
        />
      </form>

    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
      {showRecaptcha && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleRecaptchaVerify}
              onExpired={handleRecaptchaExpired}
              onError={handleRecaptchaError}
              theme="light"
              size="normal"
            />
      )}

      {/* Action Buttons Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Export and Save buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={droneOps.handleExport}
            disabled={droneOps.isProcessing}
            className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={form("exportNoteDescription")}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {form("export")}
          </button>

          {/* Save Drone Button (only for logged in users) */}
          {username && (
            <button
              type="button"
              onClick={droneOps.handleSave}
              disabled={loading || droneOps.isProcessing}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={form("saveDrone")}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h3v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              {form("saveDrone")}
            </button>
          )}
        </div>

        {/* Right side - Calculate button */}
        <button
          type="button"
          onClick={() => {
            const form = document.querySelector('form');
            if (form) {
              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
              form.dispatchEvent(submitEvent);
            }
          }}
          disabled={
            loading ||
            errors.length > 0 ||
            (showRecaptcha && !isRecaptchaVerified) ||
            (!hasFormChanged && hasLastSubmission) ||
            data === initialDataValues
          }
          className={`px-6 py-3 rounded-md text-white font-medium text-base transition-colors flex items-center ${
            loading ||
            errors.length > 0 ||
            (showRecaptcha && !isRecaptchaVerified) ||
            (!hasFormChanged && hasLastSubmission) ||
            data === initialDataValues
              ? "bg-gray-400 cursor-not-allowed"
              : showRecaptcha && !isRecaptchaVerified
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-blue-600 hover:bg-blue-700"
          }`}
          title={
            !hasFormChanged && hasLastSubmission
              ? tooltips("formDataIdentical")
              : showRecaptcha && !isRecaptchaVerified
                ? tooltips("pleaseCompleteRecaptcha")
                : errors.length > 0
                  ? tooltips("pleaseFixFormErrors")
                  : ""
          }
        >
          {!hasFormChanged && hasLastSubmission ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : showRecaptcha && !isRecaptchaVerified ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : loading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {!hasFormChanged && hasLastSubmission
            ? form("calculated")
            : loading
              ? form("calculating")
              : form("calculate")}
        </button>
      </div>
      </div>
    </div>
  );
};

export default InputForm;