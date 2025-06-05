export type VerticalCV = {
  contingencyManoeuvre:
    | "PARACHUTE_TERMINATION"
    | "STOPPING"
    | "TURN_180"
    | "ENERGY_CONVERSION"
    | "CIRCULAR_PATH";
  responseHeight: number;
  timeToOpenParachute: number;
  heightContingencyManoeuvre?: number;
  minVerticalDimension?: number;
};
