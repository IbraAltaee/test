import React from "react";
import Select from "react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { useTranslations } from "@/hooks/useTranslations";
import { InfoIconComponent } from "./infoIcon";

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
  placeholder,
  infoText,
}) => {
  const { form } = useTranslations();
  const error = getFieldError?.(name);
  
  const defaultPlaceholder = placeholder || form("selectAnOption");

  return (
      <div className="form-group mb-4 flex-1">
        <label className="inline-flex gap-1 text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {infoText && (
            <InfoIconComponent text={infoText}></InfoIconComponent>
          )}
        </label>
        <Select
          options={options}
          onChange={onChange}
          value={value}
          placeholder={defaultPlaceholder}
          classNamePrefix="react-select"
          className={`w-full ${error ? "border border-red-500 rounded-md" : ""}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
  );
};