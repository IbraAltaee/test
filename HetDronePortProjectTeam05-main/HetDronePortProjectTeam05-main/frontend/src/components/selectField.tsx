import React from "react";
import Select from "react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FaInfoCircle } from "react-icons/fa";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  options: Option[];
  name: string;
  getFieldError: (field: string) => string | undefined;
  required?: boolean;
  placeholder?: string;
  infoText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  name,
  getFieldError,
  required = false,
  placeholder = "Select an option",
  infoText,
}) => {
  const error = getFieldError?.(name);

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="form-group mb-4 flex-1">
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
        <Select
          options={options}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          classNamePrefix="react-select"
          className={`w-full ${error ? "border border-red-500 rounded-md" : ""}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </Tooltip.Provider>
  );
};
