import { FlightGeography } from "./flightGeography";
import { GRB } from "./grb";
import { LateralCV } from "./lateralCV";
import { UAV } from "./uav";
import { VerticalCV } from "./verticalCV";

export type droneOperation = {
  uav: UAV;
  lateralCV: LateralCV;
  verticalCV: VerticalCV;
  grb: GRB;
  flightGeography: FlightGeography;
};
