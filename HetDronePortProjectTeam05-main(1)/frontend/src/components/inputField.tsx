import { InfoIconComponent } from "./infoIcon";

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  name: string;
  getFieldError: (field: string) => string | undefined;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  helperText?: string;
  infoText?: string;
  maxHeightError?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  name,
  getFieldError,
  required = false,
  min,
  max,
  step,
  helperText,
  infoText,
  maxHeightError,
}) => {
  const error = getFieldError(name);

  const displayError = error || maxHeightError;

  return (
      <div className="form-group mb-4">
        <label className="inline-flex gap-1 text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {infoText && (
            <InfoIconComponent text={infoText}></InfoIconComponent>
          )}
        </label>
        <input
          type="number"
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        {displayError && (
          <p className="text-red-500 text-xs mt-1">{displayError}</p>
        )}
        {helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
  );
};
