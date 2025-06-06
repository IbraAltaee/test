"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { FaDownload, FaUpload } from "react-icons/fa";

type ImportExportSectionProps = {
  onExport: () => void;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
};

export const ImportExportSection: React.FC<ImportExportSectionProps> =
  React.memo(
    ({
      onExport,
      onImportClick,
      fileInputRef,
      onFileChange,
      isProcessing,
    }) => {
      const { form } = useTranslations();

      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FaDownload className="mr-2" />
            {form("configurationManagement")}
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            {form("configurationManagementDescription")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExport}
              disabled={isProcessing}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className="mr-2" />
              {form("export")}
            </button>
            <button
              type="button"
              onClick={onImportClick}
              disabled={isProcessing}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload className="mr-2" />
              {form("import")}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      );
    },
  );