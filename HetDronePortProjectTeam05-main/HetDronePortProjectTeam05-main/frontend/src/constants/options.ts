import type { OptionType } from "@/types/optionType";

export const droneTypes: OptionType[] = [
  { value: "MULTIROTOR", label: "Multirotor" },
  { value: "ROTORCRAFT", label: "Rotorcraft" },
  { value: "FIXEDWING", label: "Fixed Wing" },
];

export const altitudeOptions: OptionType[] = [
  { value: "barometric", label: "Barometric" },
  { value: "GPS-based", label: "GPS-based" },
];
