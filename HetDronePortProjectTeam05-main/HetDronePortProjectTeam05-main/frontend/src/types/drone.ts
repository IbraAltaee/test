import { UAV } from "@/types/uav";
import { LateralCV } from "@/types/lateralCV";
import { VerticalCV } from "@/types/verticalCV";
import { GRB } from "@/types/grb";

export type Drone = {
  name: string;
  uav: UAV;
  lateralContingencyVolume: {
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
  verticalContingencyVolume: {
    contingencyManoeuvre:
      | "PARACHUTE_TERMINATION"
      | "STOPPING"
      | "TURN_180"
      | "ENERGY_CONVERSION"
      | "CIRCULAR_PATH";
    responseHeight: number;
    timeToOpenParachute: number;
  };
  groundRiskBuffer: {
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
  };
  maxFlightAltitude: number;
};

export interface DeleteDroneConfirmationProps {
  isOpen: boolean;
  droneName: string | null;
  onUpdate: any;
  setConfirmDeleteDrone: (droneName: string | null) => void;
  setEditableDrone: (drone: Drone | undefined) => void;
}
