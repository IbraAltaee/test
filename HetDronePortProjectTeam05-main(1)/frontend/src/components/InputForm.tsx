"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";

import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/providers/AuthProvider";
import DroneOperationService from "@/services/droneOperationService";
import ValidationService from "@/services/validationService";
import {
  FormDataValues,
  initialDataValues,
} from "@/types/droneOperationFormState";
import { FieldError } from "@/types/fieldError";
import { OptionType } from "@/types/optionType";
import { ValidationRule } from "@/types/validationRule";
import { useFormHashComparison } from "@/utils/useFormHashComparison";

import { useDroneAndFormManagement } from "@/hooks/useDroneAndFormManagement";
import { useFormValidationEffects } from "@/hooks/useFormValidationEffects";
import { useRecaptcha } from "@/hooks/useRecaptcha";

import { FaCheckCircle, FaDownload, FaLock, FaSpinner, FaTimesCircle, FaUpload } from "react-icons/fa";
import { CombinedConfigurationSection } from "./formSections/CombinedConfigurationSection";
import { FlightGeographySection } from "./formSections/FlightGeographySection";
import { GroundRiskBufferSection } from "./formSections/GroundRiskBufferSection";
import { LateralContingencySection } from "./formSections/LateralContingencySection";
import { UAVDetailsSection } from "./formSections/UAVDetailsSection";
import { VerticalContingencySection } from "./formSections/VerticalContingencySection";

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

  const round2 = (num: number) => Math.round(num * 100) / 100;

  const EPSILON = 0.001;

  const isEqual = (a?: number, b?: number, epsilon = EPSILON) =>
    a !== undefined && b !== undefined && Math.abs(a - b) < epsilon;

  const handleFlightHeightChange = useCallback(
    (valStr: string) => {
      // Always allow empty input (clearing the field)
      if (valStr === "") {
        setData((prev) => ({
          ...prev,
          heightFlight: undefined,
          heightFlightFt: undefined,
        }));
        handleDataChange(valStr, "heightFlight", { min: 0.01 });
        clearFieldError("heightFlight");
        clearFieldError("heightFlightFt");
        return;
      }

      const parsedMeters = parseFloat(valStr);
      if (isNaN(parsedMeters)) return;

      const roundedMeters = round2(parsedMeters);
      const newFeet = round2(roundedMeters / 0.3048);

      setData((prev) => {
        if (
          isEqual(prev.heightFlight, roundedMeters) &&
          isEqual(prev.heightFlightFt, newFeet)
        ) {
          return prev;
        }
        return {
          ...prev,
          heightFlight: roundedMeters,
          heightFlightFt: newFeet,
        };
      });

      handleDataChange(valStr, "heightFlight", { min: 0.01 });
      clearFieldError("heightFlight");
      clearFieldError("heightFlightFt");
    },
    [handleDataChange, clearFieldError, setData]
  );

  const handleFlightHeightFtChange = useCallback(
    (valStr: string) => {
      if (valStr === "") {
        setData((prev) => ({
          ...prev,
          heightFlight: undefined,
          heightFlightFt: undefined,
        }));
        handleDataChange(valStr, "heightFlightFt", { min: 0.01 });
        clearFieldError("heightFlight");
        clearFieldError("heightFlightFt");
        return;
      }

      const parsedFeet = parseFloat(valStr);
      if (isNaN(parsedFeet)) return;

      const roundedFeet = round2(parsedFeet);
      const newMeters = round2(roundedFeet * 0.3048);

      setData((prev) => {
        if (
          isEqual(prev.heightFlightFt, roundedFeet) &&
          isEqual(prev.heightFlight, newMeters)
        ) {
          return prev;
        }
        return {
          ...prev,
          heightFlightFt: roundedFeet,
          heightFlight: newMeters,
        };
      });

      handleDataChange(valStr, "heightFlightFt", { min: 0.01 });
      clearFieldError("heightFlight");
      clearFieldError("heightFlightFt");
    },
    [handleDataChange, clearFieldError, setData]
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
      <div className="border-b border-gray-200 p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-700">
          {form("droneOperationCalculator")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {form("configureUavParameters")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 overflow-y-scroll max-h-[70vh] p-6 scrollbar scrollbar-thumb-slate-600
    [&::-webkit-scrollbar-track]:hidden
    [&::-webkit-scrollbar-button]:hidden
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar]:w-2"
      >
        <CombinedConfigurationSection
          onImportClick={droneOps.handleImportClick}
          fileInputRef={droneOps.fileInputRef as React.RefObject<HTMLInputElement>}
          onFileChange={droneOps.handleFileChange}
          isProcessing={droneOps.isProcessing}

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

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-2">
            <button
              type="button"
              onClick={droneOps.handleExport}
              disabled={droneOps.isProcessing}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={form("exportNoteDescription")}
            >
              <FaDownload className="w-4 h-4 mr-2" />
              {form("export")}
            </button>

            {username && (
              <button
                type="button"
                onClick={droneOps.handleSave}
                disabled={loading || droneOps.isProcessing}
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={form("saveDrone")}
              >
                <FaUpload className="w-4 h-4 mr-2" />
                {form("saveDrone")}
              </button>
            )}
          </div>

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
            className={`px-6 py-3 rounded-md text-white font-medium text-base transition-colors flex items-center ${loading ||
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
              <FaTimesCircle className="w-5 h-5 mr-2" />
            ) : showRecaptcha && !isRecaptchaVerified ? (
              <FaLock className="w-5 h-5 mr-2" />
            ) : loading ? (
              <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
            ) : (
              <FaCheckCircle className="w-5 h-5 mr-2" />
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