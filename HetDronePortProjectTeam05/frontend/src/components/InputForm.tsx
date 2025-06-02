"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import DroneOperationService from "@/services/droneOperationService";
import ValidationService from "@/services/validationService";
import ExportService from "@/services/exportService";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { OptionType } from "@/types/optionType";
import { FieldError } from "@/types/fieldError";
import { DroneOperationFormState } from "@/types/droneOperationFormState";
import { SubmitButton } from "./buttons/submitButton";
import { BasicButton } from "./buttons/basicButton";
import { NumberInput } from "./inputField";
import { SelectField } from "./selectField";
import { droneTypes, altitudeOptions } from "@/constants/options";
import { ValidationRule } from "@/types/validationRule";
import DroneService from "@/services/droneService";
import { Drone } from "@/types/drone";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormHashComparison } from "@/utils/useFormHashComparison";
import {useAuth} from "@/providers/AuthProvider";

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

  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [showRecaptcha, setShowRecaptcha] = useState(true);
  const [userHasVerified, setUserHasVerified] = useState(false);

  const handleRecaptchaVerify = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
      setIsRecaptchaVerified(true);
      setUserHasVerified(true);
      setShowRecaptcha(false);
      toast.success("reCAPTCHA verification completed!");
    } else {
      setRecaptchaToken(null);
      setIsRecaptchaVerified(false);

      if (!userHasVerified) {
        setShowRecaptcha(true);
      }
    }
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
  };

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
    setShowRecaptcha(true);
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
  };

  const [name, setName] = useState<string | null>(null);
  const [droneType, setDroneType] = useState<OptionType | null>(null);
  const [lateralContingencyManoeuvre, setLateralContingencyManoeuvre] =
    useState<OptionType | null>(null);
  const [verticalContingencyManoeuvre, setVerticalContingencyManoeuvre] =
    useState<OptionType | null>(null);
  const [methodOffTermination, setMethodOffTermination] =
    useState<OptionType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [maxOperationalSpeed, setMaxOperationalSpeed] = useState<number>();
  const [maxUavDimensions, setMaxUavDimensions] = useState<number>();
  const [altitudeMeasurementErrorType, setAltitudeMeasurementErrorType] =
    useState<"barometric" | "GPS-based" | null>(null);
  const [altitudeMeasurementError, setAltitudeMeasurementError] =
    useState<number>(0);
  const [gpsInaccuracy, setGpsInaccuracy] = useState<number>(3);
  const [positionError, setPositionError] = useState<number>(3);
  const [mapError, setMapError] = useState<number>(1);
  const [responseTime, setResponseTime] = useState<number>(1);

  // Flight geography
  const [heightFlight, setHeightFlight] = useState<number>();
  const [heightFlightFt, setHeightFlightFt] = useState<number>();

  // Lateral CV fields
  const [rollAngle, setRollAngle] = useState<number>(30);
  const [pitchAngle, setPitchAngle] = useState<number>(45);
  const [lateralParachuteTime, setLateralParachuteTime] = useState<number>();

  // Vertical CV fields
  const [responseHeight, setResponseHeight] = useState<number>();
  const [verticalParachuteTime, setVerticalParachuteTime] = useState<number>();

  // GRB fields
  const [grbParachuteTime, setGrbParachuteTime] = useState<number>();
  const [windSpeed, setWindSpeed] = useState<number>();
  const [parachuteDescent, setParachuteDescent] = useState<number>();
  const [glideRatio, setGlideRatio] = useState<number>();

  const { username, token } = useAuth()
  const [errors, setErrors] = useState<FieldError[]>([]);

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find((e) => e.field === fieldName);
    return error?.message;
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => prev.filter((e) => e.field !== fieldName));
  };

  useEffect(() => {
    if (maxOperationalSpeed && responseTime) {
      const value = Number(
        (maxOperationalSpeed * 0.7 * responseTime).toFixed(2),
      );
      setResponseHeight(value);
    }
  }, [maxOperationalSpeed, responseTime]);

  useEffect(() => {
    if (heightFlight !== undefined) {
      onHeightChange(heightFlight);
    }
  }, [heightFlight, onHeightChange]);

  useEffect(() => {
    if (droneType && lateralContingencyManoeuvre) {
      if (
        droneType.value === "MULTIROTOR" &&
        lateralContingencyManoeuvre.value === "TURN_180"
      ) {
        setErrors((prev) => [
          ...prev.filter((e) => e.field !== "lateralContingencyManoeuvre"),
          {
            field: "lateralContingencyManoeuvre",
            message: "TURN_180 manoeuvre not suitable for multirotors",
          },
        ]);
      } else if (
        droneType.value === "FIXEDWING" &&
        lateralContingencyManoeuvre.value === "STOPPING"
      ) {
        setErrors((prev) => [
          ...prev.filter((e) => e.field !== "lateralContingencyManoeuvre"),
          {
            field: "lateralContingencyManoeuvre",
            message: "STOPPING manoeuvre not suitable for fixed-wing aircraft",
          },
        ]);
      } else {
        clearFieldError("lateralContingencyManoeuvre");
      }
    }
  }, [droneType, lateralContingencyManoeuvre]);

  useEffect(() => {
    if (droneType && methodOffTermination) {
      if (
        droneType.value === "FIXEDWING" &&
        methodOffTermination.value === "BALLISTIC_APPROACH"
      ) {
        setErrors((prev) => [
          ...prev.filter((e) => e.field !== "methodOffTermination"),
          {
            field: "methodOffTermination",
            message:
              "Ballistic approach only allowed for multirotors and rotorcrafts",
          },
        ]);
      } else {
        clearFieldError("methodOffTermination");
      }
    }
  }, [droneType, methodOffTermination]);

  
  useEffect(() => {
    if (heightFlight !== undefined) {
      onHeightChange(heightFlight);
    }
  }, [heightFlight, onHeightChange]);


  const handleDroneTypeChange = (selectedOption: OptionType | null) => {
    setDroneType(selectedOption);
    setLateralContingencyManoeuvre(null);
    setVerticalContingencyManoeuvre(null);
    setMethodOffTermination(null);
    if (maxOperationalSpeed !== undefined) {
      handleMaxOperationalSpeedChange(String(maxOperationalSpeed));
    }
    clearFieldError("droneType");
  };

  function handleLateralContingencyManoeuvreChange(
    selectedOption: SingleValue<OptionType>,
  ) {
    setLateralContingencyManoeuvre(selectedOption);
    if (selectedOption?.value !== "PARACHUTE_TERMINATION") {
      setLateralParachuteTime(undefined);
    }
    setMethodOffTermination(null);
  }

  function handleVerticalContingencyManoeuvreChange(
    selectedOption: SingleValue<OptionType>,
  ) {
    setVerticalContingencyManoeuvre(selectedOption);
    if (selectedOption?.value !== "PARACHUTE_TERMINATION") {
      setVerticalParachuteTime(undefined);
    }
    setMethodOffTermination(null);
    clearFieldError("verticalContingencyManoeuvre");
  }

  function handleMethodOffTerminationChange(
    selectedOption: SingleValue<OptionType>,
  ) {
    setMethodOffTermination(selectedOption);
    if (selectedOption?.value !== "PARACHUTE") {
      setGrbParachuteTime(undefined);
      setWindSpeed(undefined);
      setParachuteDescent(undefined);
    }
    if (selectedOption?.value !== "OFF_GLIDING") {
      setGlideRatio(undefined);
    }
    if (windSpeed !== undefined) {
      handleMaxPermissibleWindSpeedChange(windSpeed.toString());
    }
    if (grbParachuteTime !== undefined) {
      handleGrbParachuteTimeChange(grbParachuteTime.toString());
    }
  }

  const handleAltitudeMeasurementErrorTypeChange = (value: string) => {
    setAltitudeMeasurementErrorType(value as "barometric" | "GPS-based");
    if (value === "barometric") {
      setAltitudeMeasurementError(1);
    } else if (value === "GPS-based") {
      setAltitudeMeasurementError(4);
    }
    clearFieldError("altitudeMeasurementErrorType");
  };

  const handleNumericChange = (
    value: string,
    field: string,
    setState: (val: number) => void,
    rules?: ValidationRule,
  ) => {
    const parsed = parseFloat(value);
    let error: string | null = null;


    if (isNaN(parsed)) {
      error = "Value must be a number";
    } else if (rules?.min !== undefined && parsed < rules.min) {
      error = `Value must be at least ${rules.min}`;
    } else if (rules?.max !== undefined && parsed > rules.max) {
      error = `Value must be at most ${rules.max}`;
    } else if (rules?.custom) {
      error = rules.custom(parsed);
    }


    if (error) {
      setErrors((prev) => [
        ...prev.filter((e) => e.field !== field),
        { field, message: error! },
      ]);
    } else {
      clearFieldError(field);
    }

    setState(parsed);
  };

  const handleAltitudeMeasurementErrorChange = (val: string) =>
    handleNumericChange(
      val,
      "altitudeMeasurementError",
      setAltitudeMeasurementError,
      {
        min: altitudeMeasurementErrorType === "barometric" ? 1 : 4,
      },
    );

  const handleMaxOperationalSpeedChange = (val: string) =>
    handleNumericChange(val, "maxOperationalSpeed", setMaxOperationalSpeed, {
      min: 0.0001,
      custom: (v) =>
        droneType?.value === "MULTIROTOR" && v < 3
          ? "Speed below 3 m/s is unrealistic for multirotor"
          : null,
    });

  const handleMaxUavDimensionsChange = (val: string) =>
    handleNumericChange(val, "maxUavDimensions", setMaxUavDimensions, {
      min: 0.0001,
    });

  const handleGpsInaccuracyChange = (val: string) =>
    handleNumericChange(val, "gpsInaccuracy", setGpsInaccuracy, {
      min: 0.0001,
    });

  const handlePositionErrorChange = (val: string) =>
    handleNumericChange(val, "positionError", setPositionError, { min: 0 });

  const handleRollAngleChange = (val: string) =>
    handleNumericChange(val, "rollAngle", setRollAngle, { min: 1, max: 30 });

  const handlePitchAngleChange = (val: string) =>
    handleNumericChange(val, "pitchAngle", setPitchAngle, { min: 1, max: 45 });

  const handleGrbParachuteTimeChange = (val: string) =>
    handleNumericChange(val, "grbParachuteTime", setGrbParachuteTime, {
      min: 3,
    });

  const handleLateralParachuteTimeChange = (val: string) =>
    handleNumericChange(val, "lateralParachuteTime", setLateralParachuteTime, {
      min: 0,
    });

  const handleVerticalParachuteTimeChange = (val: string) =>
    handleNumericChange(
      val,
      "verticalParachuteTime",
      setVerticalParachuteTime,
      { min: 0 },
    );

  const handleResponseHeightChange = (val: string) =>
    handleNumericChange(val, "responseHeight", setResponseHeight, {
      min:0,
    });

  const handleRateOfDescentChange = (val: string) =>
    handleNumericChange(val, "parachuteDescent", setParachuteDescent, {
      min: 0,
      custom: (v) => (v <= 0 ? "Descent rate must be positive" : null),
    });

  const handleGlideRatioChange = (val: string) =>
    handleNumericChange(val, "glideRatio", setGlideRatio, { min: 0.0001 });

  const handleFlightHeightChange = (val: string) => {
    handleNumericChange(val, "heightFlight", setHeightFlight, {
      custom: (v) =>
        v < 3 * (maxUavDimensions || 0)
          ? `Height must be at least 3× Max UAV Dimensions (${3 * (maxUavDimensions || 0)}m)`
          : null,
    });

    const parsed = parseFloat(val);


    handleNumericChange((parsed/ 0.3048).toFixed(2), "heightFlightFt", setHeightFlightFt, {
      custom: (v) =>
        v < 3 * (maxUavDimensions || 0) / 0.3048
        ? `Height must be at least 3x Max UAV Dimensions (${3 * (maxUavDimensions || 0)  / 0.3048}ft)`
        : null,
    });
  }

  const handleFlightHeightFtChange =(val: string) => {
    handleNumericChange(val, "heightFlightFt", setHeightFlightFt, {
      custom: (v) =>
        v < 3 * (maxUavDimensions || 0) / 0.3048
        ? `Height must be at least 3x Max UAV Dimensions (${3 * (maxUavDimensions || 0)  / 0.3048}ft)`
        : null,
    });

    const parsed = parseFloat(val);

    handleNumericChange((parsed * 0.3048).toFixed(2), "heightFlight", setHeightFlight, {
      custom: (v) =>
        v < 3 * (maxUavDimensions || 0)
          ? `Height must be at least 3× Max UAV Dimensions (${3 * (maxUavDimensions || 0)}m)`
          : null,
    });

  }

  const handleMapErrorChange = (val: string) =>
    handleNumericChange(val, "mapError", setMapError, { min: 0 });

  const handleResponseTimeChange = (val: string) =>
    handleNumericChange(val, "responseTime", setResponseTime, { min: 0 });

  const handleMaxPermissibleWindSpeedChange = (val: string) =>
    handleNumericChange(val, "windSpeed", setWindSpeed, {
      min: 3,
      custom: (v) =>
        methodOffTermination?.value === "PARACHUTE" && v < 3
          ? "Wind speed below 3 m/s is not considered realistic"
          : null,
    });

  const isInputValid = () => {
    return ValidationService.validateFormForJSON(
      {
        droneType,
        maxOperationalSpeed,
        maxUavDimensions,
        altitudeMeasurementErrorType,
        lateralContingencyManoeuvre,
        verticalContingencyManoeuvre,
        methodOffTermination,
        heightFlight,
        lateralParachuteTime,
        verticalParachuteTime,
        grbParachuteTime,
        windSpeed,
        parachuteDescent,
        glideRatio,
      },
      setErrors,
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInputValid()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    if (!hasFormChanged && hasLastSubmission) {
      return;
    }

    await submitFormData();
  };

  const buildFormState = (): DroneOperationFormState => ({
    droneType: droneType?.value || null,
    lateralContingencyManoeuvre: lateralContingencyManoeuvre?.value || null,
    verticalContingencyManoeuvre: verticalContingencyManoeuvre?.value || null,
    methodOffTermination: methodOffTermination?.value || null,
    maxOperationalSpeed,
    maxUavDimensions,
    altitudeMeasurementErrorType,
    altitudeMeasurementError,
    gpsInaccuracy,
    positionError,
    mapError,
    responseTime,
    heightFlight,
    rollAngle,
    pitchAngle,
    lateralParachuteTime,
    verticalParachuteTime,
    grbParachuteTime,
    windSpeed,
    parachuteDescent,
    glideRatio,
  });

  const handleExport = () => {
    if (!isInputValid()) {
      toast.error(
        "Please fill in all required fields correctly before exporting",
      );
      return;
    }

    const formState = buildFormState();

    ExportService.exportDroneFormConfig(
      formState,
      `drone_form_config_${new Date().toISOString()}.json`,
    );
    toast.success("Form configuration exported successfully!");
  };


  async function submitFormData() {
    const formState = buildFormState();

    if (!DroneOperationService.validateRequiredFields(formState)) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const formData = DroneOperationService.buildFormData(formState);

    try {
      const response = await DroneOperationService.calculateDroneOperation(formData, recaptchaToken);

      markFormAsSubmitted(formState);
      setLoading(false);
      onCalculate(response);
      toast.success("Drone operation calculated successfully!");
    } catch (error: any) {
      setLoading(false);
      console.error("Error:", error);

      if (error.requiresRecaptcha) {
      if (error.recaptchaExpired) {
        resetRecaptcha();
          toast.error('reCAPTCHA verification expired. Please verify again and resubmit.');
        } else {
          setShowRecaptcha(true);
          toast.error(error.error || 'Please complete the reCAPTCHA verification');
        }
      } else {
        toast.error(error.error || error.message || 'Calculation failed');
      }
    }
  }

  const { isFormChanged, markFormAsSubmitted, hasLastSubmission } = useFormHashComparison();

  const currentFormState = useMemo(() => buildFormState(), [
    droneType, maxOperationalSpeed, maxUavDimensions, altitudeMeasurementErrorType,
    lateralContingencyManoeuvre, verticalContingencyManoeuvre, methodOffTermination,
    heightFlight, rollAngle, pitchAngle, lateralParachuteTime, verticalParachuteTime,
    grbParachuteTime, windSpeed, parachuteDescent, glideRatio
  ]);

  const hasFormChanged = isFormChanged(currentFormState);

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    if (!username) {
      toast.error("Please log in to save the configuration");
      return;
    }

    if (!isInputValid()) {
      toast.error("Please fill in all required fields correctly before saving");
      return;
    }

    if (!name) {
      toast.error("Please provide a name for the drone configuration");
      return;
    }

    if (!token) return;

    const drone: Drone = {
      name: name,
      uav: {
        type: (droneType?.value as "MULTIROTOR" | "FIXEDWING" | "ROTORCRAFT") || "MULTIROTOR",
        maxOperationalSpeed: maxOperationalSpeed || 0,
        maxCharacteristicDimension: maxUavDimensions || 0,
        altitudeMeasurementErrorType: altitudeMeasurementErrorType || "barometric",
        altitudeMeasurementError: altitudeMeasurementError || 0,
        gpsInaccuracy: gpsInaccuracy || 0,
        positionHoldingError: positionError || 0,
        mapError: mapError || 0,
        responseTime: responseTime || 0,
      },
      lateralContingencyVolume: {
        contingencyManoeuvre: (lateralContingencyManoeuvre?.value as "PARACHUTE_TERMINATION" | "TURN_180" | "STOPPING" | "ENERGY_CONVERSION" | "CIRCULAR_PATH") || "TURN_180",
        rollAngle: rollAngle || 0,
        pitchAngle: pitchAngle || 0,
        timeToOpenParachute: lateralParachuteTime || 0,
      },
      verticalContingencyVolume: {
        contingencyManoeuvre: (verticalContingencyManoeuvre?.value as "PARACHUTE_TERMINATION" | "TURN_180" | "STOPPING" | "ENERGY_CONVERSION" | "CIRCULAR_PATH") || "TURN_180",
        timeToOpenParachute: verticalParachuteTime || 0,
        responseHeight: responseHeight || 0,
      },
      groundRiskBuffer: {
        termination: (methodOffTermination?.value as "PARACHUTE" | "OFF_GLIDING" | "OFF_NO_GLIDING" | "SIMPLIFIED_APPROACH" | "BALLISTIC_APPROACH") || "PARACHUTE",
        timeToOpenParachute: grbParachuteTime || 0,
        maxPermissibleWindSpeed: windSpeed || 0,
        rateOfDescent: parachuteDescent || 0,
        glideRatio: glideRatio || 0,
      },
      maxFlightAltitude: heightFlight || 0,
    }

    setLoading(true);

    try {
      await DroneService.createDrone(drone, token);
      toast.success("Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const formState = JSON.parse(content) as DroneOperationFormState;

        if (!validateImportedData(formState)) {
          toast.error("Invalid configuration file format");
          return;
        }

        if (formState.droneType) {
          const droneTypeOption = droneTypes.find(
            (dt) => dt.value === formState.droneType,
          );
          setDroneType(droneTypeOption || null);
        }

        setMaxOperationalSpeed(formState.maxOperationalSpeed);
        setMaxUavDimensions(formState.maxUavDimensions);
        setAltitudeMeasurementErrorType(formState.altitudeMeasurementErrorType);
        setAltitudeMeasurementError(formState.altitudeMeasurementError);
        setGpsInaccuracy(formState.gpsInaccuracy);
        setPositionError(formState.positionError);
        setMapError(formState.mapError);
        setResponseTime(formState.responseTime);
        setHeightFlight(formState.heightFlight);
        setRollAngle(formState.rollAngle);
        setPitchAngle(formState.pitchAngle);
        setLateralParachuteTime(formState.lateralParachuteTime);
        setVerticalParachuteTime(formState.verticalParachuteTime);
        setGrbParachuteTime(formState.grbParachuteTime);
        setWindSpeed(formState.windSpeed);
        setParachuteDescent(formState.parachuteDescent);
        setGlideRatio(formState.glideRatio);

        // Wait a bit for React to process state updates (can sometimes help when dropdown options depend on other states)
        await delay(50);

        if (formState.heightFlight) {
          setHeightFlightFt(Number((formState.heightFlight/0.3048).toFixed(2)));
        }


        if (formState.droneType && formState.lateralContingencyManoeuvre) {
          const droneTypeOption = droneTypes.find(
            (dt) => dt.value === formState.droneType,
          );
          const lateralOptions =
            DroneOperationService.getLateralContingencyManoeuvres(
              droneTypeOption || null,
            );
          const lateralOption = lateralOptions.find(
            (lo) => lo.value === formState.lateralContingencyManoeuvre,
          );
          setLateralContingencyManoeuvre(lateralOption || null);
        }

        await delay(50);

        if (formState.droneType && formState.verticalContingencyManoeuvre) {
          const droneTypeOption = droneTypes.find(
            (dt) => dt.value === formState.droneType,
          );
          const verticalOptions =
            DroneOperationService.getVerticalContingencyManoeuvres(
              droneTypeOption || null,
            );
          const verticalOption = verticalOptions.find(
            (vo) => vo.value === formState.verticalContingencyManoeuvre,
          );
          setVerticalContingencyManoeuvre(verticalOption || null);
        }

        await delay(50);

        if (formState.droneType && formState.methodOffTermination) {
          const droneTypeOption = droneTypes.find(
            (dt) => dt.value === formState.droneType,
          );
          const methodOptions = DroneOperationService.getMethodOfTermination(
            droneTypeOption || null,
            lateralContingencyManoeuvre,
            verticalContingencyManoeuvre,
          );
          const methodOption = methodOptions.find(
            (mo) => mo.value === formState.methodOffTermination,
          );
          setMethodOffTermination(methodOption || null);
        }
        setErrors([]);
        toast.success("Configuration imported successfully!");
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast.error(
          "Failed to parse configuration file. Please ensure it's a valid JSON file.",
        );
        setLoading(false);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const validateImportedData = (data: any): data is DroneOperationFormState => {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    if (
      data.droneType !== null &&
      typeof data.droneType !== "string" &&
      data.droneType !== undefined
    ) {
      return false;
    }

    return !(data.droneType &&
      !droneTypes.some((dt) => dt.value === data.droneType));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md m-4 text-gray-800 w-full max-w-2xl space-y-6 overflow-auto max-h-screen border border-gray-200"
      >
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Drone Operation Calculator
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure UAV parameters to calculate operational volumes
          </p>
        </div>

        {username && <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            General Information
          </h3>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Configuration Name
          </label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg mb-4 ${getFieldError("name") ? "border-red-500" : ""
              }`}
            name="name"
          />

        </div>}

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            UAV Details
          </h3>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <SelectField
              label="Drone Type"
              value={droneType}
              onChange={handleDroneTypeChange}
              options={droneTypes}
              name="droneType"
              getFieldError={getFieldError}
              required
              infoText="A classification of UAV based on their design and flight characteristics."
            />

            <NumberInput
              label="Maximum operational speed (m/s)"
              value={maxOperationalSpeed || ""}
              onChange={handleMaxOperationalSpeedChange}
              name="maxOperationalSpeed"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="Maximum operational speed that is flown."
            />

            <NumberInput
              label="Maximum UAV dimensions (m)"
              value={maxUavDimensions || ""}
              onChange={handleMaxUavDimensionsChange}
              name="maxUavDimensions"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText='The "Maximum UAV dimensions" is the maximum possible
                        length of a straight line that can be spanned from one point on the UAV geometry to
                        another point. Propellers and rotors are part of the geometry, whereby their most
                        unfavorable position is considered.'
            />

            <SelectField
              label="Altitude measurement error type"
              name="altitudeMeasurementErrorType"
              value={
                altitudeOptions.find(
                  (opt) => opt.value === altitudeMeasurementErrorType,
                ) || null
              }
              onChange={(selected) =>
                handleAltitudeMeasurementErrorTypeChange(selected?.value ?? "")
              }
              options={altitudeOptions}
              getFieldError={getFieldError}
              required
              placeholder="Select type"
              infoText="The nature or source of inaccuracies in altitude readings."
            />

            <NumberInput
              label="Altitude measurement error (m)"
              value={altitudeMeasurementError}
              onChange={handleAltitudeMeasurementErrorChange}
              name="altitudeMeasurementError"
              getFieldError={getFieldError}
              required
              min={altitudeMeasurementErrorType === "GPS-based" ? 4 : 1}
              step={"any"}
              infoText="The numerical deviation between the actual altitude of the UAV and the altitude reported by its sensors or systems."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="GPS inaccuracy (m)"
              value={gpsInaccuracy}
              onChange={handleGpsInaccuracyChange}
              name="gpsInaccuracy"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="The deviation between the actual geographical position of the UAV and the position reported by its GPS system, caused by factors like satellite geometry, signal multipath, and atmospheric conditions."
            />

            <NumberInput
              label="Position holding error (m)"
              value={positionError}
              onChange={handlePositionErrorChange}
              name="positionError"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="The maximum deviation a UAV exhibits from a commanded or intended position while attempting to hover or remain stationary, due to system limitations or environmental influences."
            />

            <NumberInput
              label="Map error (m)"
              value={mapError}
              onChange={handleMapErrorChange}
              name="mapError"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="Discrepancies between the real-world geography and the digital map data used for navigation, which can lead to incorrect positional assumptions during autonomous or assisted flight."
            />

            <NumberInput
              label="Response time (s)"
              value={responseTime}
              onChange={handleResponseTimeChange}
              name="responseTime"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="The time interval between the detection of an abnormal situation and the initiation of the corresponding contingency or emergency response action from a remote pilot or automated system."
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Flight Geography
          </h3>
          <NumberInput
            label="Flight height (m) (AGL)"
            value={heightFlight || ""}
            onChange={handleFlightHeightChange}
            name="heightFlight"
            getFieldError={getFieldError}
            required
            min={9}
            step={"any"}
            helperText="At least 3 times drone dimension"
            infoText="The vertical extent within which the UAV is authorized to operate under normal procedures, typically defined as part of the flight geography. It is constrained by airspace regulations and the intended use case. This is measured in AGL."
            maxHeightError={maxHeightError} 
          />
          <NumberInput
            label="Flight height (ft) (AGL)"
            value={heightFlightFt || ""}
            onChange={handleFlightHeightFtChange}
            name="heightFlightFt"
            getFieldError={getFieldError}
            required
            min={9}
            step={"any"}
            helperText="At least 3 times drone dimension"
            infoText="The vertical extent within which the UAV is authorized to operate under normal procedures, typically defined as part of the flight geography. It is constrained by airspace regulations and the intended use case. This is measured in AGL."
            maxHeightError={maxHeightError} 
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Lateral Contingency Volume
          </h3>
          <SelectField
            label="Contingency manoeuvre"
            value={lateralContingencyManoeuvre}
            onChange={handleLateralContingencyManoeuvreChange}
            options={DroneOperationService.getLateralContingencyManoeuvres(
              droneType,
            )}
            name="lateralContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText="A predefined flight action executed when the UAV exits its intended flight geography and enters the contingency volume, designed to regain control or return to safe operational status without escalating the situation."
          />

          {lateralContingencyManoeuvre?.value === "TURN_180" && (
            <NumberInput
              label="Roll angle (°)"
              value={rollAngle}
              onChange={handleRollAngleChange}
              name="rollAngle"
              getFieldError={getFieldError}
              required
              min={1}
              max={90}
              step={"any"}
              helperText="Default: 30°"
              infoText="The angle between the drone’s lateral axis and the horizontal plane, showing the tilt to the left or right, which influences turning and lateral movement during flight adjustments or contingency actions."
            />
          )}

          {lateralContingencyManoeuvre?.value === "STOPPING" && (
            <NumberInput
              label="Pitch angle (°)"
              value={pitchAngle}
              onChange={handlePitchAngleChange}
              name="pitchAngle"
              getFieldError={getFieldError}
              required
              min={1}
              max={90}
              step={"any"}
              helperText="Default: 45°"
              infoText="The angle between the drone's longitudinal axis and the horizontal plane, indicating how much the nose is tilted up or down, which affects ascent/descent and forward motion during contingency manoeuvres."
            />
          )}

          {lateralContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" && (
            <NumberInput
              label="Time to open parachute (s)"
              value={lateralParachuteTime || ""}
              onChange={handleLateralParachuteTimeChange}
              name="lateralParachuteTime"
              getFieldError={getFieldError}
              required
              min={0}
              step={"any"}
              infoText="The duration from the activation of the parachute deployment mechanism to the moment the parachute is fully open and decelerating the UAV effectively."
            />
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Vertical Contingency Volume
          </h3>
          <NumberInput
            label="Response height (m)"
            value={responseHeight || ""}
            onChange={handleResponseHeightChange}
            name="responseHeight"
            getFieldError={getFieldError}
            required
            min={0}
            step={"any"}
            helperText="This value is calculated based on the maximum operational speed and response time, it should only be changed with good reason!!"
            infoText="The altitude range within the contingency volume required for executing effective contingency manoeuvres before a loss of control or transition to emergency procedures becomes necessary."
          />

          <SelectField
            label="Contingency manoeuvre"
            value={verticalContingencyManoeuvre}
            onChange={handleVerticalContingencyManoeuvreChange}
            options={DroneOperationService.getVerticalContingencyManoeuvres(
              droneType,
            )}
            name="verticalContingencyManoeuvre"
            getFieldError={getFieldError}
            required
            infoText="The altitude range within the contingency volume required for executing effective contingency manoeuvres before a loss of control or transition to emergency procedures becomes necessary."
          />

          {verticalContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
            lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" && (
              <NumberInput
                label="Time to open parachute (s)"
                value={verticalParachuteTime || ""}
                onChange={handleVerticalParachuteTimeChange}
                name="verticalParachuteTime"
                getFieldError={getFieldError}
                required
                min={0}
                step={"any"}
                infoText="The duration from the activation of the parachute deployment mechanism to the moment the parachute is fully open and decelerating the UAV effectively."
              />
            )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Ground Risk Buffer
          </h3>
          <SelectField
            label="Method of termination"
            value={methodOffTermination}
            onChange={handleMethodOffTerminationChange}
            options={DroneOperationService.getMethodOfTermination(
              droneType,
              lateralContingencyManoeuvre,
              verticalContingencyManoeuvre,
            )}
            name="methodOffTermination"
            getFieldError={getFieldError}
            required
            infoText="The technique used to bring an uncontrolled UAV to the ground within the designated ground risk buffer, such as shutting off propulsion or deploying a parachute, impacting how far and fast the drone will fall."
          />

          {methodOffTermination?.value === "PARACHUTE" && (
            <>
              {lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
                verticalContingencyManoeuvre?.value !==
                "PARACHUTE_TERMINATION" && (
                  <NumberInput
                    label="Time to open parachute (s)"
                    value={grbParachuteTime || ""}
                    onChange={handleGrbParachuteTimeChange}
                    name="grbParachuteTime"
                    getFieldError={getFieldError}
                    required
                    min={0}
                    step={"any"}
                    infoText="The duration from the activation of the parachute deployment mechanism to the moment the parachute is fully open and decelerating the UAV effectively."
                  />
                )}

              <NumberInput
                label="Max wind speed (m/s)"
                value={windSpeed || ""}
                onChange={handleMaxPermissibleWindSpeedChange}
                name="windSpeed"
                getFieldError={getFieldError}
                required
                min={3}
                step={"any"}
                helperText="Minimum 3 m/s"
                infoText="Maximum wind speed specified in the operations manual up to which the UAV may
                          be operated.
                          "
              />
              <NumberInput
                label="Parachute descent rate (m/s)"
                value={parachuteDescent || ""}
                onChange={handleRateOfDescentChange}
                name="parachuteDescent"
                getFieldError={getFieldError}
                required
                min={0.1}
                step={"any"}
                infoText="The speed at which a UAV descends after parachute deployment, typically measured in meters per second, influencing the impact location and required buffer zone size."
              />
            </>
          )}

          {methodOffTermination?.value === "OFF_GLIDING" && (
            <NumberInput
              label="Glide ratio"
              value={glideRatio || ""}
              onChange={handleGlideRatioChange}
              name="glideRatio"
              getFieldError={getFieldError}
              required
              min={1}
              step={"any"}
              infoText="The horizontal distance a UAV can travel forward relative to the vertical distance it descends without propulsion, important for estimating landing zones in uncontrolled descent scenarios."
            />
          )}
        </div>
        {showRecaptcha && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Security Verification
            </h3>

            <div className="space-y-4">
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
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <BasicButton onClick={handleExport} title="Export" color="red" />
            <BasicButton onClick={handleImport} title="Import" color="green" />
            {username &&<BasicButton onClick={handleSave} title="Save Drone" color="blue" />}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden" />
          </div>

          {/* Submit button */}
          <SubmitButton
            loading={loading}
            hasErrors={errors.length > 0}
            showRecaptcha={showRecaptcha}
            isRecaptchaVerified={isRecaptchaVerified}
            hasFormChanged={hasFormChanged || !hasLastSubmission}
          />
        </div>
      </form>
    </>
  );
};

export default InputForm;