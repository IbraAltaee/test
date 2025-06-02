export type UAV = {
  type: "MULTIROTOR" | "FIXEDWING" | "ROTORCRAFT";
  maxOperationalSpeed: number;
  maxCharacteristicDimension: number;
  altitudeMeasurementErrorType: "barometric" | "GPS-based";
  gpsInaccuracy: number;
  positionHoldingError: number;
  mapError: number;
  responseTime: number;
  altitudeMeasurementError?: number;
};
