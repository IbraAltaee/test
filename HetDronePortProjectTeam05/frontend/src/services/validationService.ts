import { FieldError } from "../types/fieldError";
import { OptionType } from "../types/optionType";

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
}

const validateFormForJSON = (
  params: ValidateParams,
  setErrors: (errors: FieldError[]) => void,
): boolean => {
  let isValid = true;
  const newErrors: FieldError[] = [];

  const addError = (field: string, message: string) => {
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
  } = params;

  if (!droneType) addError("droneType", "Drone type is required");

  if (maxOperationalSpeed === undefined || maxOperationalSpeed === null) {
    addError("maxOperationalSpeed", "Maximum operational speed is required");
  } else if (maxOperationalSpeed <= 0) {
    addError("maxOperationalSpeed", "Speed must be positive");
  }

  if (maxUavDimensions === undefined || maxUavDimensions === null) {
    addError("maxUavDimensions", "Maximum UAV dimensions is required");
  } else if (maxUavDimensions <= 0) {
    addError("maxUavDimensions", "Characteristic dimension must be positive");
  }

  if (!altitudeMeasurementErrorType) {
    addError(
      "altitudeMeasurementErrorType",
      "Altitude measurement error type is required",
    );
  }

  if (!lateralContingencyManoeuvre) {
    addError(
      "lateralContingencyManoeuvre",
      "Lateral contingency manoeuvre is required",
    );
  }

  if (!verticalContingencyManoeuvre) {
    addError(
      "verticalContingencyManoeuvre",
      "Vertical contingency manoeuvre is required",
    );
  }

  if (!methodOffTermination) {
    addError("methodOffTermination", "Method of termination is required");
  }

  if (heightFlight === undefined || heightFlight === null) {
    addError("heightFlight", "Height is required");
  } else {
    if (heightFlight < 9) {
      addError("heightFlight", "Height must be at least 9 meters");
    }
    if (maxUavDimensions && heightFlight < 3 * maxUavDimensions) {
      addError(
        "heightFlight",
        `Height must be at least 3×CD (${3 * maxUavDimensions}m)`,
      );
    }
  }

  if (
    lateralContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
    !lateralParachuteTime
  ) {
    addError("lateralParachuteTime", "Time to open parachute is required");
  }

  if (
    verticalContingencyManoeuvre?.value === "PARACHUTE_TERMINATION" &&
    lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
    !verticalParachuteTime
  ) {
    addError("verticalParachuteTime", "Time to open parachute is required");
  }

  if (methodOffTermination?.value === "PARACHUTE") {
    if (
      lateralContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
      verticalContingencyManoeuvre?.value !== "PARACHUTE_TERMINATION" &&
      !grbParachuteTime
    ) {
      addError("grbParachuteTime", "Time to open parachute is required");
    } else if (grbParachuteTime && grbParachuteTime < 3) {
      addError(
        "grbParachuteTime",
        "Time to open parachute must be at least 3 seconds",
      );
    }

    if (windSpeed === undefined || windSpeed === null) {
      addError("windSpeed", "Max wind speed is required");
    } else if (windSpeed < 3) {
      addError(
        "windSpeed",
        "Wind speed below 3 m/s is not considered realistic",
      );
    }

    if (!parachuteDescent) {
      addError("parachuteDescent", "Parachute descent rate is required");
    } else if (parachuteDescent <= 0) {
      addError("parachuteDescent", "Descent rate must be positive");
    }
  }

  if (methodOffTermination?.value === "OFF_GLIDING" && !glideRatio) {
    addError("glideRatio", "Glide ratio is required");
  }

  setErrors(newErrors);
  return isValid;
};

const ValidationService = {
  validateFormForJSON,
};

export default ValidationService;
