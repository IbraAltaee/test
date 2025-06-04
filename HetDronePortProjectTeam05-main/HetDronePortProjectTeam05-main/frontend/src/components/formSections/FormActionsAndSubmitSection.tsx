"use client";

import React from "react";
import { BasicButton } from "../buttons/basicButton";
import { SubmitButton } from "../buttons/submitButton";

type FormActionsAndSubmitSectionProps = {
  onExport: () => void;
  onImportClick: () => void;
  onSave: () => void;
  username: string | null | undefined;
  isSaveDisabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  hasErrors: boolean;
  showRecaptcha: boolean;
  isRecaptchaVerified: boolean;
  hasFormChanged: boolean;
};

export const FormActionsAndSubmitSection: React.FC<FormActionsAndSubmitSectionProps> =
  React.memo(
    ({
      onExport,
      onImportClick,
      onSave,
      username,
      isSaveDisabled,
      fileInputRef,
      onFileChange,
      isSubmitting,
      hasErrors,
      showRecaptcha,
      isRecaptchaVerified,
      hasFormChanged,
    }) => {
      return (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="space-x-2 sm:space-x-4">
            <BasicButton onClick={onExport} title="Export" color="red" />
            <BasicButton onClick={onImportClick} title="Import" color="green" />
            {username && (
              <BasicButton
                onClick={onSave}
                title="Save Drone"
                color="blue"
                isDisabled={isSaveDisabled}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
          <SubmitButton
            loading={isSubmitting}
            hasErrors={hasErrors}
            showRecaptcha={showRecaptcha}
            isRecaptchaVerified={isRecaptchaVerified}
            hasFormChanged={hasFormChanged}
          />
        </div>
      );
    },
  );
