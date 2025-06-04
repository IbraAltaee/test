import { FieldError } from "@/types/fieldError";
import { OptionType } from "@/types/optionType";

interface ValidateParams {
  droneType: OptionType | null;
  maxOperationalSpeed?: number;
  maxUavDimensions?: number;
  altitudeMeasurementErrorType: "barometric" | "GPS-based" | null;
  lateralContingencyManoeuvre: OptionType | null;
  verticalContingencyManoeuvre: OptionType | null;
  methodOffTermination: OptionType | null;
  heightFlight?: number;
  lateralParachuteTime?: number;
  verticalParachuteTime?: number;
  grbParachuteTime?: number;
  windSpeed?: number;
  parachuteDescent?: number;
  glideRatio?: number;
  isExport: Boolean;
}

type TranslationFunction = (key: string, params?: Record<string, any>) => string;

const validateFormForJSON = (
  params: ValidateParams,
  setErrors: (errors: FieldError[]) => void,
  t?: TranslationFunction,
): boolean => {
  let isValid = true;
  const newErrors: FieldError[] = [];

  // Fallback translation function for backwards compatibility
  const translate = t || ((key: string, params?: Record<string, any>) => {
    // Fallback to English strings if no translation function provided
    const fallbacks: Record<string, string> = {
      'validation.droneTypeRequired': 'Drone type is required',
      'validation.maxOperationalSpeedRequired': 'Maximum operational speed is required',
      'validation.speedMustBePositive': 'Speed must be positive',
      'validation.maxUavDimensionsRequired': 'Maximum UAV dimensions is required',
      'validation.characteristicDimensionMustBePositive': 'Characteristic dimension must be positive',
      'validation.altitudeMeasurementErrorTypeRequired': 'Altitude measurement error type is required',
      'validation.lateralContingencyManoeuvreRequired': 'Lateral contingency manoeuvre is required',
      'validation.verticalContingencyManoeuvreRequired': 'Vertical contingency manoeuvre is required',
      'validation.methodOfTerminationRequired': 'Method of termination is required',
      'validation.heightRequired': 'Height is required',
      'validation.heightMustBeAtLeast3CD': `Height must be at least 3×CD (${params?.min || 0}m)`,
      'validation.timeToOpenParachuteRequired': 'Time to open parachute is required',
      'validation.timeToOpenParachuteMinimum3Seconds': 'Time to open parachute must be at least 3 seconds',
      'validation.maxWindSpeedRequired': 'Max wind speed is required',
      'validation.windSpeedBelow3MsNotRealistic': 'Wind speed below 3 m/s is not considered realistic',
      'validation.parachuteDescentRateRequired': 'Parachute descent rate is required',
      'validation.descentRateMustBePositive': 'Descent rate must be positive',
      'validation.glideRatioRequired': 'Glide ratio is required',
    };
    return fallbacks[key] || key;
  });

  const addError = (field: string, translationKey: string, params?: Record<string, any>) => {
    const message = translate(translationKey, params);
    newErrors.push({ field, message });
    isValid = false;
  };

  const {
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
    isExport,
  } = params;

  if (!droneType) {
    addError("droneType", "validation.droneTypeRequired");
  }

  if (maxOperationalSpeed === undefined || maxOperationalSpeed === null) {
    addError("maxOperationalSpeed", "validation.maxOperationalSpeedRequired");
  } else if (maxOperationalSpeed <= 0) {
    addError("maxOperationalSpeed", "validation.speedMustBePositive");
  }

  if (maxUavDimensions === undefined || maxUavDimensions === null) {
    addError("maxUavDimensions", "validation.maxUavDimensionsRequired");
  } else if (maxUavDimensions <= 0) {
    addError("maxUavDimensions", "validation.characteristicDimensionMustBePositive");
  }

  if (!altitudeMeasurementErrorType) {
    addError("altitudeMeasurementErrorType", "validation.altitudeMeasurementErrorTypeRequired");
  }

  if (!lateralContingencyManoeuvre) {
    addError("lateralContingencyManoeuvre", "validation.lateralContingencyManoeuvreRequired");
  }

  if (!verticalContingencyManoeuvre) {
    addError("verticalContingencyManoeuvre", "validation.verticalContingencyManoeuvreRequired");
  }

  if (!methodOffTermination) {
    addError("methodOffTermination", "validation.methodOfTerminationRequired");
  }

  if (isExport === true) {
    if (heightFlight === undefined || heightFlight === null) {
      addError("heightFlight", "validation.heightRequired");
    } else {
      if (maxUavDimensions && heightFlight < 3 * maxUavDimensions) {
        addError("heightFlight", "validation.heightMustBeAtLeast3CD", { 
          min: 3 * maxUavDimensions 
        });
      }
    }
  }

  if (
    lateralContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
    !lateralParachuteTime
  ) {
    addError("lateralParachuteTime", "validation.timeToOpenParachuteRequired");
  }

  if (
    verticalContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
    lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
    !verticalParachuteTime
  ) {
    addError("verticalParachuteTime", "validation.timeToOpenParachuteRequired");
  }

  if (methodOffTermination?.value === "PARACHUTE") {
    if (
      lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
      verticalContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
      !grbParachuteTime
    ) {
      addError("grbParachuteTime", "validation.timeToOpenParachuteRequired");
    } else if (grbParachuteTime && grbParachuteTime < 3) {
      addError("grbParachuteTime", "validation.timeToOpenParachuteMinimum3Seconds");
    }

    if (windSpeed === undefined || windSpeed === null) {
      addError("windSpeed", "validation.maxWindSpeedRequired");
    } else if (windSpeed < 3) {
      addError("windSpeed", "validation.windSpeedBelow3MsNotRealistic");
    }

    if (!parachuteDescent) {
      addError("parachuteDescent", "validation.parachuteDescentRateRequired");
    } else if (parachuteDescent <= 0) {
      addError("parachuteDescent", "validation.descentRateMustBePositive");
    }
  }

  if (methodOffTermination?.value === "OFF_GLIDING" && !glideRatio) {
    addError("glideRatio", "validation.glideRatioRequired");
  }

  setErrors(newErrors);
  return isValid;
};

const ValidationService = {
  validateFormForJSON,
};

export default ValidationService;