"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  zoneName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  zoneName,
  loading,
  onConfirm,
  onCancel,
}) => {
  const { confirmations, common } = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">
          {confirmations("confirmDelete")}
        </h3>
        <p className="text-gray-600 mb-6">
          {confirmations("areYouSureDeleteZone", { zoneName })}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {common("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? confirmations("deleting") : common("delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;