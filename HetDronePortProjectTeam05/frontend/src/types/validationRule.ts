export type ValidationRule = {
  min?: number;
  max?: number;
  custom?: (value: number) => string | null;
};
