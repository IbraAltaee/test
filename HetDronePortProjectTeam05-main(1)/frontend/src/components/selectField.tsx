import { useTranslations } from "@/hooks/useTranslations";
import React, { useRef } from "react";
import Select from "react-select";
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
  autoScrollOnOpen?: boolean;
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
  autoScrollOnOpen = false,
}) => {
  const { form } = useTranslations();
  const error = getFieldError?.(name);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const defaultPlaceholder = placeholder || form("selectAnOption");

  const handleMenuOpen = () => {
    if (autoScrollOnOpen && selectRef.current) {
      setTimeout(() => {
        selectRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }, 150);
    }
  };

  return (
    <div className="form-group mb-4 flex-1" ref={selectRef}>
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
        onMenuOpen={handleMenuOpen}
        menuPlacement="auto"
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
          }),
        }}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};