export interface FormDataValues {
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
}

export const initialDataValues: FormDataValues = {
  maxOperationalSpeed: undefined,
  maxUavDimensions: undefined,
  altitudeMeasurementError: 0,
  gpsInaccuracy: 3,
  positionError: 3,
  mapError: 1,
  responseTime: 1,
  heightFlight: undefined,
  heightFlightFt: undefined,
  rollAngle: 30,
  pitchAngle: 45,
  lateralParachuteTime: undefined,
  responseHeight: undefined,
  verticalParachuteTime: undefined,
  grbParachuteTime: undefined,
  windSpeed: undefined,
  parachuteDescent: undefined,
  glideRatio: undefined,
};

export interface DroneOperationFormState extends FormDataValues {
  droneType: string | null;
  lateralContingencyManoeuvre: string | null;
  verticalContingencyManoeuvre: string | null;
  methodOffTermination: string | null;
  altitudeMeasurementErrorType: "barometric" | "GPS-based" | null;
}
