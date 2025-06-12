export type LateralCV = {
  contingencyManoeuvre:
    | "PARACHUTE_TERMINATION"
    | "STOPPING"
    | "TURN_180"
    | "ENERGY_CONVERSION"
    | "CIRCULAR_PATH";
  rollAngle: number;
  timeToOpenParachute: number;
  pitchAngle: number;
  lateralExtension?: number;
};
