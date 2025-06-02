// components/PointList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Zone } from '@/types/zone';

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
  onValidationChange
}) => {
  const [pointErrors, setPointErrors] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});


  const isValidPartialInput = (value: string): boolean => {
    // Allow empty, just minus sign, or valid decimal patterns
    if (value === '' || value === '-') return true;
    
    // Allow numbers with decimal point at the end: "50."
    if (/^-?\d+[.,]$/.test(value)) return true;
    
    // Allow complete decimal numbers: "50.123"
    if (/^-?\d+([.,]\d+)?$/.test(value)) return true;
    
    // Allow decimal point at start: ".123"
    if (/^-?[.,]\d*$/.test(value)) return true;
    
    return false;
  };

  const normalizeCoordinate = (value: string): number | null => {
    if (value === '' || value === '-' || value.endsWith('.') || value.endsWith(',')) {
      return null;
    }
    const normalizedValue = value.replace(',', '.');
    const num = parseFloat(normalizedValue);
    return isNaN(num) ? null : num;
  };

  const validateFinalCoordinate = (value: number, field: 'lat' | 'lng'): string | null => {
    // Check for default coordinates (0,0)
    if (value === 0) {
      return 'Coordinates cannot be 0 (default values not allowed)';
    }
    
    // Validate latitude range
    if (field === 'lat' && (value < -90 || value > 90)) {
      return 'Latitude must be between -90 and 90';
    }
    
    // Validate longitude range
    if (field === 'lng' && (value < -180 || value > 180)) {
      return 'Longitude must be between -180 and 180';
    }
    
    return null;
  };

  // Notify parent of validation changes
  useEffect(() => {
    if (onValidationChange) {
      const errors: string[] = [];
      
      // Check for point-specific errors
      Object.values(pointErrors).forEach(error => {
        if (error) errors.push(error);
      });
      
      // Check for incomplete points
      zone.path.forEach((point, index) => {
        if ((point.lat === null && point.lng !== null) || 
            (point.lat !== null && point.lng === null)) {
          errors.push(`Point ${index + 1} is incomplete`);
        }
      });
      
      // Check for default coordinates (0,0)
      zone.path.forEach((point, index) => {
        if (point.lat === 0 && point.lng === 0) {
          errors.push(`Point ${index + 1} cannot be at coordinates (0,0)`);
        }
      });
      
      // Check minimum points requirement
      const validPoints = zone.path.filter(point => 
        point.lat !== null && point.lng !== null && 
        !(point.lat === 0 && point.lng === 0) // Exclude (0,0) coordinates
      );
      if (validPoints.length < 3) {
        errors.push(`At least 3 complete points required (current: ${validPoints.length})`);
      }
      
      onValidationChange(errors);
    }
  }, [zone.path, pointErrors, onValidationChange]);

  const addPoint = () => {
    if (!onZoneChange) return;
    
    onZoneChange({
      ...zone,
      path: [...zone.path, { lat: null, lng: null }]
    });
  };

  const removePoint = (index: number) => {
    if (!onZoneChange) return;
    
    // Remove associated errors and input values
    const newErrors = { ...pointErrors };
    const newInputValues = { ...inputValues };
    
    delete newErrors[`${index}-lat`];
    delete newErrors[`${index}-lng`];
    delete newInputValues[`${index}-lat`];
    delete newInputValues[`${index}-lng`];
    
    // Adjust keys for remaining points
    const adjustedErrors: { [key: string]: string } = {};
    const adjustedInputValues: { [key: string]: string } = {};
    
    Object.entries(newErrors).forEach(([key, value]) => {
      const [pointIndex, field] = key.split('-');
      const idx = parseInt(pointIndex);
      if (idx > index) {
        adjustedErrors[`${idx - 1}-${field}`] = value;
      } else if (idx < index) {
        adjustedErrors[key] = value;
      }
    });
    
    Object.entries(newInputValues).forEach(([key, value]) => {
      const [pointIndex, field] = key.split('-');
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
      path: zone.path.filter((_, i) => i !== index)
    });
  };

  const handleInputChange = (index: number, field: 'lat' | 'lng', value: string) => {
    if (!onZoneChange) return;
    
    const inputKey = `${index}-${field}`;
    
    // Always update the input display value
    setInputValues(prev => ({
      ...prev,
      [inputKey]: value
    }));
    
    // Check if input is valid format (allow partial typing)
    if (!isValidPartialInput(value)) {
      // Invalid characters, don't update the zone data
      return;
    }
    
    // Parse the coordinate value
    const coordinateValue = normalizeCoordinate(value);
    
    // Update the zone data
    const newPath = [...zone.path];
    newPath[index] = {
      ...newPath[index],
      [field]: coordinateValue
    };
    
    onZoneChange({
      ...zone,
      path: newPath
    });
    
    // Validate if we have a complete number
    const errorKey = `${index}-${field}`;
    const newErrors = { ...pointErrors };
    
    if (coordinateValue !== null) {
      const error = validateFinalCoordinate(coordinateValue, field);
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
    } else {
      // Remove error while typing
      delete newErrors[errorKey];
    }
    
    setPointErrors(newErrors);
  };

  const getFieldError = (index: number, field: 'lat' | 'lng'): string | null => {
    return pointErrors[`${index}-${field}`] || null;
  };

  const getInputClassName = (index: number, field: 'lat' | 'lng') => {
    const hasError = getFieldError(index, field);
    return `w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 ${
      hasError 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:ring-blue-500'
    }`;
  };

  const getDisplayValue = (value: number | null, index: number, field: 'lat' | 'lng'): string => {
    const inputKey = `${index}-${field}`;
    // Use stored input value if available
    if (inputValues[inputKey] !== undefined) {
      return inputValues[inputKey];
    }
    
    // Otherwise use the actual value
    return value !== null ? value.toString() : '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Points ({zone.path.length})</h4>
        {editable && (
          <button
            onClick={addPoint}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Add Point
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
                  <label className="text-xs text-gray-500">Latitude</label>
                  {editable ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.,-]*"
                      value={getDisplayValue(point.lat, index, 'lat')}
                      onChange={(e) => handleInputChange(index, 'lat', e.target.value)}
                      className={getInputClassName(index, 'lat')}
                      placeholder="Enter latitude"
                    />
                  ) : (
                    <div className="text-sm">{point.lat ?? 'N/A'}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Longitude</label>
                  {editable ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.,-]*"
                      autoComplete="off"
                      value={getDisplayValue(point.lng, index, 'lng')}
                      onChange={(e) => handleInputChange(index, 'lng', e.target.value)}
                      className={getInputClassName(index, 'lng')}
                      placeholder="Enter longitude"
                    />
                  ) : (
                    <div className="text-sm">{point.lng ?? 'N/A'}</div>
                  )}
                </div>
              </div>
              {editable && (
                <button
                  onClick={() => removePoint(index)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Remove Point"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
            
            {/* Display validation errors */}
            {editable && (
              <div className="ml-10 grid grid-cols-2 gap-2">
                <div>
                  {getFieldError(index, 'lat') && (
                    <p className="text-xs text-red-600">{getFieldError(index, 'lat')}</p>
                  )}
                </div>
                <div>
                  {getFieldError(index, 'lng') && (
                    <p className="text-xs text-red-600">{getFieldError(index, 'lng')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {zone.path.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No points added yet. {editable ? 'Click "Add Point" to start.' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointList;