"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Zone } from "@/types/zone";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface PointListProps {
  zone: Zone;
  editable: boolean;
  onZoneChange?: (zone: Zone) => void;
  onValidationChange?: (errors: string[]) => void;
}

const PointList: React.FC<PointListProps> = ({
  zone,
  editable,
  onZoneChange,
  onValidationChange,
}) => {
  const { zone: zoneTranslations, form, validation, common } = useTranslations();
  const [pointErrors, setPointErrors] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: number | null }>({});

  const validateFinalCoordinate = (
    value: number,
    field: "lat" | "lng",
  ): string | null => {
    if (value === 0) {
      return validation("coordinatesCannotBe0");
    }

    if (field === "lat" && (value < -90 || value > 90)) {
      return validation("latitudeMustBeBetween");
    }

    if (field === "lng" && (value < -180 || value > 180)) {
      return validation("longitudeMustBeBetween");
    }

    return null;
  };

  useEffect(() => {
    if (onValidationChange) {
      const errors: string[] = [];

      Object.values(pointErrors).forEach((error) => {
        if (error) errors.push(error);
      });

      zone.path.forEach((point, index) => {
        if (
          (point.lat === null && point.lng !== null) ||
          (point.lat !== null && point.lng === null)
        ) {
          errors.push(validation("pointIncomplete", { index: index + 1 }));
        }
      });

      zone.path.forEach((point, index) => {
        if (point.lat === 0 && point.lng === 0) {
          errors.push(validation("pointCannotBe00", { index: index + 1 }));
        }
      });

      const validPoints = zone.path.filter(
        (point) =>
          point.lat !== null &&
          point.lng !== null &&
          !(point.lat === 0 && point.lng === 0),
      );
      if (validPoints.length < 3) {
        errors.push(
          zoneTranslations("atLeast3CompletePointsRequired", { count: validPoints.length }),
        );
      }
      onValidationChange(errors);
    }
  }, [zone.path, pointErrors, onValidationChange, validation]);

  const addPoint = () => {
    if (!onZoneChange) return;

    onZoneChange({
      ...zone,
      path: [...zone.path, { lat: null, lng: null }],
    });
  };

  const removePoint = (index: number) => {
    if (!onZoneChange) return;

    const newErrors = { ...pointErrors };
    const newInputValues = { ...inputValues };

    delete newErrors[`${index}-lat`];
    delete newErrors[`${index}-lng`];
    delete newInputValues[`${index}-lat`];
    delete newInputValues[`${index}-lng`];

    const adjustedErrors: { [key: string]: string } = {};
    const adjustedInputValues: { [key: string]: number | null } = {};

    Object.entries(newErrors).forEach(([key, value]) => {
      const [pointIndex, field] = key.split("-");
      const idx = parseInt(pointIndex);
      if (idx > index) {
        adjustedErrors[`${idx - 1}-${field}`] = value;
      } else if (idx < index) {
        adjustedErrors[key] = value;
      }
    });

    Object.entries(newInputValues).forEach(([key, value]) => {
      const [pointIndex, field] = key.split("-");
      const idx = parseInt(pointIndex);
      if (idx > index) {
        adjustedInputValues[`${idx - 1}-${field}`] = value;
      } else if (idx < index) {
        adjustedInputValues[key] = value;
      }
    });

    setPointErrors(adjustedErrors);
    setInputValues(adjustedInputValues);

    onZoneChange({
      ...zone,
      path: zone.path.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (
    index: number,
    field: "lat" | "lng",
    value: number,
  ) => {
    if (!onZoneChange) return;

    const inputKey = `${index}-${field}`;

    setInputValues((prev) => ({
      ...prev,
      [inputKey]: value,
    }));

    const newPath = [...zone.path];
    newPath[index] = {
      ...newPath[index],
      [field]: value,
    };

    onZoneChange({
      ...zone,
      path: newPath,
    });

    const errorKey = `${index}-${field}`;
    const newErrors = { ...pointErrors };

    if (value !== null) {
      const error = validateFinalCoordinate(value, field);
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
    } else {
      delete newErrors[errorKey];
    }

    setPointErrors(newErrors);
  };

  const getFieldError = (
    index: number,
    field: "lat" | "lng",
  ): string | null => {
    return pointErrors[`${index}-${field}`] || null;
  };

  const getInputClassName = (index: number, field: "lat" | "lng") => {
    const hasError = getFieldError(index, field);
    return `w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;
  };

  const getDisplayValue = (
    value: number | null,
    index: number,
    field: "lat" | "lng",
  ): number | null => {
    const inputKey = `${index}-${field}`;
    if (inputValues[inputKey] !== undefined && inputValues[inputKey] !== null) {
      return inputValues[inputKey];
    }

    return value;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">
          {zoneTranslations("points")} ({zone.path.length})
        </h4>
        {editable && (
          <button
            onClick={addPoint}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            {zoneTranslations("addPoint")}
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {zone.path.map((point, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2 p-2 border rounded">
              <span className="text-sm font-medium w-8">{index + 1}:</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">
                    {zoneTranslations("latitude")}
                  </label>
                  {editable ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={getDisplayValue(point.lat, index, "lat") || ""}
                      onChange={(e) =>
                        handleInputChange(index, "lat", parseFloat(e.target.value))
                      }
                      className={getInputClassName(index, "lat")}
                      placeholder={form("enterLatitude")}
                    />
                  ) : (
                    <div className="text-sm">{point.lat ?? common("noData")}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    {zoneTranslations("longitude")}
                  </label>
                  {editable ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={getDisplayValue(point.lng, index, "lng") || ""}
                      onChange={(e) =>
                        handleInputChange(index, "lng", parseFloat(e.target.value))
                      }
                      className={getInputClassName(index, "lng")}
                      placeholder={form("enterLongitude")}
                    />
                  ) : (
                    <div className="text-sm">{point.lng ?? common("noData")}</div>
                  )}
                </div>
              </div>
              {editable && (
                <button
                  onClick={() => removePoint(index)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title={form("removePoint")}
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>

            {editable && (
              <div className="ml-10 grid grid-cols-2 gap-2">
                <div>
                  {getFieldError(index, "lat") && (
                    <p className="text-xs text-red-600">
                      {getFieldError(index, "lat")}
                    </p>
                  )}
                </div>
                <div>
                  {getFieldError(index, "lng") && (
                    <p className="text-xs text-red-600">
                      {getFieldError(index, "lng")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {zone.path.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            {zoneTranslations("noPointsAdded")} {editable ? zoneTranslations("clickAddPointToStart") : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointList;