export type GRB = {
  termination:
    | "OFF_NO_GLIDING"
    | "OFF_GLIDING"
    | "PARACHUTE"
    | "SIMPLIFIED_APPROACH"
    | "BALLISTIC_APPROACH";
  timeToOpenParachute: number;
  maxPermissibleWindSpeed: number;
  rateOfDescent: number;
  glideRatio: number;
  minLateralDimension?: number;
};
