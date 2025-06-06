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
import { LoadConfigurationSection } from "./formSections/LoadConfigurationSection";
import { ImportExportSection } from "./formSections/ImportExportSection";
import { SubmitButton } from "./buttons/submitButton";

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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md m-4 text-gray-800 w-full max-w-2xl space-y-6 overflow-y-scroll max-h-screen border border-gray-200 scrollbar scrollbar-thumb-slate-600
    [&::-webkit-scrollbar-track]:hidden
    [&::-webkit-scrollbar-button]:hidden
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar]:w-2"
    
    >
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-700">
          {form("droneOperationCalculator")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {form("configureUavParameters")}
        </p>
      </div>

      <ImportExportSection
        onExport={droneOps.handleExport}
        onImportClick={droneOps.handleImportClick}
        fileInputRef={droneOps.fileInputRef as React.RefObject<HTMLInputElement>}
        onFileChange={droneOps.handleFileChange}
        isProcessing={droneOps.isProcessing}
      />

      {droneOps.availableDrones.length > 0 && (
        <LoadConfigurationSection
          availableDrones={droneOps.availableDrones}
          selectedDroneOption={droneOps.selectedDroneOption}
          onSelectedDroneChange={droneOps.setSelectedDroneOption}
          onLoad={droneOps.handleLoadSelectedDrone}
        />
      )}

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
            }
            }
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

      {showRecaptcha && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {form("securityVerification")}
          </h3>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleRecaptchaVerify}
            onExpired={handleRecaptchaExpired}
            onError={handleRecaptchaError}
            theme="light"
            size="normal"
          />
        </div>
      )}

      {/* Submit Button and Save Drone Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="space-x-2 sm:space-x-4">
          {username && (
            <button
              type="button"
              onClick={droneOps.handleSave}
              disabled={loading || droneOps.isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form("saveDrone")}
            </button>
          )}
        </div>
        <SubmitButton
          loading={loading}
          hasErrors={errors.length > 0}
          showRecaptcha={showRecaptcha}
          isRecaptchaVerified={isRecaptchaVerified}
          hasFormChanged={hasFormChanged || !hasLastSubmission}
          emptyForm={data === initialDataValues}
        />
      </div>
    </form>
  );
};

export default InputForm;