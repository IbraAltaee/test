import * as Tooltip from "@radix-ui/react-tooltip";
import { FaInfoCircle } from "react-icons/fa";

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
    <Tooltip.Provider delayDuration={0}>
      <div className="form-group mb-4">
        <label className="inline-flex gap-1 text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {infoText && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <FaInfoCircle />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-50 max-w-xs"
                  side="right"
                >
                  {infoText}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
        </label>
        <input
          type="number"
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
    </Tooltip.Provider>
  );
};
