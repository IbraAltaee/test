import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface SubmitButtonProps {
  loading: boolean;
  hasErrors: boolean;
  showRecaptcha?: boolean;
  isRecaptchaVerified?: boolean;
  hasFormChanged: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  hasErrors,
  showRecaptcha = false,
  isRecaptchaVerified = true,
  hasFormChanged,
}) => {
  const { form, tooltips } = useTranslations();

  const isDisabled =
    loading ||
    hasErrors ||
    (showRecaptcha && !isRecaptchaVerified) ||
    !hasFormChanged;

  const getButtonText = () => {
    if (!hasFormChanged) {
      return form("calculated");
    }
    if (loading) return form("calculating");
    return form("calculate");
  };

  const getStatusIcon = () => {
    if (!hasFormChanged) {
      return (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (showRecaptcha && !isRecaptchaVerified) {
      return (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (loading) {
      return (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    }

    return null;
  };

  const getTooltip = () => {
    if (!hasFormChanged) {
      return tooltips("formDataIdentical");
    }
    if (showRecaptcha && !isRecaptchaVerified) {
      return tooltips("pleaseCompleteRecaptcha");
    }
    if (hasErrors) {
      return tooltips("pleaseFixFormErrors");
    }
    return "";
  };

  const getButtonColor = () => {
    if (isDisabled) {
      return "bg-gray-400 cursor-not-allowed";
    }
    if (showRecaptcha && !isRecaptchaVerified) {
      return "bg-orange-500 hover:bg-orange-600";
    }
    return "bg-blue-600 hover:bg-blue-700";
  };

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`px-8 py-3 rounded-md text-white font-medium text-base transition-colors ${getButtonColor()}`}
      title={getTooltip()}
    >
      <span className="flex items-center">
        {getStatusIcon()}
        {getButtonText()}
      </span>
    </button>
  );
};