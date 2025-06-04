import type { OptionType } from "@/types/optionType";

export const getDroneTypes = (t: (key: string) => string): OptionType[] => [
  { value: "MULTIROTOR", label: t("droneTypes.multirotor") },
  { value: "ROTORCRAFT", label: t("droneTypes.rotorcraft") },
  { value: "FIXEDWING", label: t("droneTypes.fixedWing") },
];

export const getAltitudeOptions = (t: (key: string) => string): OptionType[] => [
  { value: "barometric", label: t("altitudeOptions.barometric") },
  { value: "GPS-based", label: t("altitudeOptions.gpsBased") },
];

export const getLateralContingencyManoeuvres = (t: (key: string) => string): OptionType[] => [
  { value: "STOPPING", label: t("contingencyManoeuvres.stopping") },
  { value: "TURN_180", label: t("contingencyManoeuvres.turn180") },
  { value: "PARACHUTE_TERMINATION", label: t("contingencyManoeuvres.triggerParachute") },
  { value: "ENERGY_CONVERSION", label: t("contingencyManoeuvres.energyConversion") },
  { value: "CIRCULAR_PATH", label: t("contingencyManoeuvres.circularPath") },
];

export const getVerticalContingencyManoeuvres = (t: (key: string) => string): OptionType[] => [
  { value: "ENERGY_CONVERSION", label: t("contingencyManoeuvres.energyConversion") },
  { value: "CIRCULAR_PATH", label: t("contingencyManoeuvres.circularPath") },
  { value: "PARACHUTE_TERMINATION", label: t("contingencyManoeuvres.triggerParachute") },
];

export const getTerminationMethods = (t: (key: string) => string): OptionType[] => [
  { value: "OFF_NO_GLIDING", label: t("terminationMethods.powerOffNoGliding") },
  { value: "OFF_GLIDING", label: t("terminationMethods.powerOffGliding") },
  { value: "SIMPLIFIED_APPROACH", label: t("terminationMethods.simplifiedApproach") },
  { value: "BALLISTIC_APPROACH", label: t("terminationMethods.ballisticApproach") },
  { value: "PARACHUTE", label: t("terminationMethods.parachuteTermination") },
];

export const droneTypes: OptionType[] = [
  { value: "MULTIROTOR", label: "Multirotor" },
  { value: "ROTORCRAFT", label: "Rotorcraft" },
  { value: "FIXEDWING", label: "Fixed Wing" },
];

export const altitudeOptions: OptionType[] = [
  { value: "barometric", label: "Barometric" },
  { value: "GPS-based", label: "GPS-based" },
];