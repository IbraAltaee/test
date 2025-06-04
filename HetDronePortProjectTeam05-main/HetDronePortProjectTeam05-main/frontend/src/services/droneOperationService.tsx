import { OptionType } from "@/types/optionType";
import { droneOperation } from "@/types/droneOperation";
import { DroneOperationFormState } from "@/types/droneOperationFormState";

const calculateDroneOperation = async (
  droneOperation: droneOperation,
  recaptchaToken: string | null = null,
) => {
  const requestBody: any = { ...droneOperation };

  if (recaptchaToken) {
    requestBody.recaptchaToken = recaptchaToken;
  }

  const response = await fetch("/api/drone/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

const getLateralContingencyManoeuvres = (
  droneType: { value: string } | null,
): OptionType[] => {
  if (!droneType) return [];

  const result: OptionType[] = [];

  if (["ROTORCRAFT", "MULTIROTOR"].includes(droneType.value)) {
    result.push({ value: "STOPPING", label: "Stopping" });
  }

  if (droneType.value === "FIXEDWING") {
    result.push({ value: "TURN_180", label: "180° turn" });
  }

  result.push({ value: "PARACHUTE_TERMINATION", label: "Trigger parachute" });

  return result;
};

const getVerticalContingencyManoeuvres = (
  droneType: { value: string } | null,
): OptionType[] => {
  if (!droneType) return [];

  const result: OptionType[] = [];

  if (["ROTORCRAFT", "MULTIROTOR"].includes(droneType.value)) {
    result.push({ value: "ENERGY_CONVERSION", label: "Energy conversion" });
  }

  if (droneType.value === "FIXEDWING") {
    result.push({ value: "CIRCULAR_PATH", label: "Circular path" });
  }

  result.push({ value: "PARACHUTE_TERMINATION", label: "Trigger parachute" });

  return result;
};

const getMethodOfTermination = (
  droneType: { value: string } | null,
  lateral: { value: string } | null,
  vertical: { value: string } | null,
): OptionType[] => {
  if (!droneType) return [];

  const hasParachute =
    lateral?.value === "PARACHUTE_TERMINATION" ||
    vertical?.value === "PARACHUTE_TERMINATION";

  const options: OptionType[] = [];

  if (!hasParachute) {
    if (droneType.value === "FIXEDWING") {
      options.push(
        { value: "OFF_NO_GLIDING", label: "Power off (no gliding)" },
        { value: "OFF_GLIDING", label: "Power off (gliding)" },
      );
    } else {
      options.push(
        { value: "SIMPLIFIED_APPROACH", label: "Simplified approach" },
        { value: "BALLISTIC_APPROACH", label: "Ballistic approach" },
      );
    }
  }

  options.push({ value: "PARACHUTE", label: "Parachute termination" });

  return options;
};

const validateRequiredFields = (
  formState: DroneOperationFormState,
): boolean => {
  const {
    droneType,
    maxOperationalSpeed,
    maxUavDimensions,
    altitudeMeasurementErrorType,
    lateralContingencyManoeuvre,
    verticalContingencyManoeuvre,
    methodOffTermination,
    heightFlight,
  } = formState;

  return !(
    !droneType ||
    !maxOperationalSpeed ||
    !maxUavDimensions ||
    !altitudeMeasurementErrorType ||
    !lateralContingencyManoeuvre ||
    !verticalContingencyManoeuvre ||
    !methodOffTermination ||
    !heightFlight
  );
};

const buildUAV = (formState: DroneOperationFormState) => {
  return {
    type: formState.droneType! as "MULTIROTOR" | "FIXEDWING" | "ROTORCRAFT",
    maxOperationalSpeed: formState.maxOperationalSpeed!,
    maxCharacteristicDimension: formState.maxUavDimensions!,
    altitudeMeasurementErrorType: formState.altitudeMeasurementErrorType!,
    altitudeMeasurementError: formState.altitudeMeasurementError,
    gpsInaccuracy: formState.gpsInaccuracy,
    positionHoldingError: formState.positionError,
    mapError: formState.mapError,
    responseTime: formState.responseTime,
  };
};

const buildLateralCV = (formState: DroneOperationFormState) => {
  return {
    contingencyManoeuvre: formState.lateralContingencyManoeuvre! as
      | "TURN_180"
      | "PARACHUTE_TERMINATION"
      | "STOPPING"
      | "ENERGY_CONVERSION"
      | "CIRCULAR_PATH",
    rollAngle:
      formState.lateralContingencyManoeuvre! === "TURN_180"
        ? formState.rollAngle || 30
        : 30,
    timeToOpenParachute:
      formState.lateralContingencyManoeuvre! === "PARACHUTE_TERMINATION"
        ? formState.lateralParachuteTime || 0
        : 0,
    pitchAngle:
      formState.lateralContingencyManoeuvre! === "STOPPING"
        ? formState.pitchAngle || 45
        : 45,
  };
};

const buildVerticalCV = (formState: DroneOperationFormState) => {
  return {
    contingencyManoeuvre: formState.verticalContingencyManoeuvre! as
      | "TURN_180"
      | "PARACHUTE_TERMINATION"
      | "STOPPING"
      | "ENERGY_CONVERSION"
      | "CIRCULAR_PATH",
    responseHeight: 0,
    timeToOpenParachute:
      formState.verticalContingencyManoeuvre! === "PARACHUTE_TERMINATION"
        ? formState.verticalParachuteTime || 0
        : 0,
  };
};

const buildGRB = (formState: DroneOperationFormState) => {
  return {
    termination: formState.methodOffTermination! as
      | "OFF_NO_GLIDING"
      | "OFF_GLIDING"
      | "PARACHUTE"
      | "SIMPLIFIED_APPROACH"
      | "BALLISTIC_APPROACH",
    timeToOpenParachute:
      formState.methodOffTermination! === "PARACHUTE"
        ? formState.grbParachuteTime || 0
        : 0,
    maxPermissibleWindSpeed:
      formState.methodOffTermination! === "PARACHUTE"
        ? formState.windSpeed || 0
        : 0,
    rateOfDescent:
      formState.methodOffTermination! === "PARACHUTE"
        ? formState.parachuteDescent || 0
        : 0,
    glideRatio:
      formState.methodOffTermination! === "OFF_GLIDING"
        ? formState.glideRatio || 0
        : 0,
  };
};

const buildFormData = (formState: DroneOperationFormState): droneOperation => {
  return {
    uav: buildUAV(formState),
    lateralCV: buildLateralCV(formState),
    verticalCV: buildVerticalCV(formState),
    grb: buildGRB(formState),
    flightGeography: {
      heightFlightGeo: formState.heightFlight ?? 0,
    },
  };
};

const DroneOperationService = {
  calculateDroneOperation,
  getLateralContingencyManoeuvres,
  getVerticalContingencyManoeuvres,
  getMethodOfTermination,
  validateRequiredFields,
  buildFormData,
};

export default DroneOperationService;
