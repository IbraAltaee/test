'use client';

import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Zone } from '@/types/zone';
import PointList from './PointList';
import ZoneMap from './ZoneMap';

interface ZoneFormProps {
  mode: 'create' | 'edit';
  zone: Zone;
  originalZoneName?: string;
  loading: boolean;
  error: string | null;
  onZoneChange: (zone: Zone) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ZoneForm: React.FC<ZoneFormProps> = ({
  mode,
  zone,
  originalZoneName,
  loading,
  error,
  onZoneChange,
  onSave,
  onCancel
}) => {
  const [nameError, setNameError] = useState<string | null>(null);
  const [pointErrors, setPointErrors] = useState<string[]>([]);

  const title = mode === 'create' ? 'Create New Zone' : `Edit Zone: ${originalZoneName}`;
  const saveButtonText = mode === 'create' 
    ? (loading ? 'Creating...' : 'Create Zone')
    : (loading ? 'Saving...' : 'Save Changes');

  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Zone name is required';
    if (name.trim().length < 2) return 'Zone name must be at least 2 characters';
    if (name.trim().length > 50) return 'Zone name must not exceed 50 characters';
    return null;
  };

  const isFormValid = (): boolean => {
    const nameValid = !nameError && zone.name.trim().length > 0;
    const pointsValid = pointErrors.length === 0;
    const hasMinPoints = zone.path.filter(p => p.lat !== null && p.lng !== null).length >= 3;
    return nameValid && pointsValid && hasMinPoints;
  };

  const getValidPointsCount = () => {
    return zone.path.filter(point => 
      point.lat !== null && point.lng !== null
    ).length;
  };

  const handleNameChange = (name: string) => {
    const error = validateName(name);
    setNameError(error);
    onZoneChange({ ...zone, name });
  };

  const getFormErrors = (): string[] => {
    const errors: string[] = [];
    
    if (nameError) {
      errors.push(nameError);
    }
    
    pointErrors.forEach(error => {
      errors.push(error);
    });
    
    return errors;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft />
            </button>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>

          {/* Error messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Validation errors */}
          {!isFormValid() && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
              <p className="font-medium">Please fix the following issues:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {getFormErrors().map((formError, index) => (
                  <li key={index}>{formError}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4">
                {/* Zone name input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      nameError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter zone name"
                    maxLength={50}
                  />
                  {nameError && (
                    <p className="text-sm text-red-600 mt-1">{nameError}</p>
                  )}
                </div>
                
                {/* Points list */}
                <PointList 
                  zone={zone} 
                  editable={true} 
                  onZoneChange={onZoneChange}
                  onValidationChange={setPointErrors}
                />
            
              </div>
            </div>

            {/* Right column - Map */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Map Preview</h4>
              <ZoneMap 
                zone={zone} 
                mapId={`${mode}-${zone.name}-${zone.path.length}-${Date.now()}`} 
              />
              
              {/* Map info */}
              <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                <h6 className="text-sm font-medium text-blue-800 mb-1">Map Information</h6>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Total points: {zone.path.length}</div>
                  <div>Valid points: {getValidPointsCount()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading || !isFormValid()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                loading || !isFormValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={!isFormValid() ? 'Please fix form errors before saving' : ''}
            >
              {saveButtonText}
            </button>
          </div>

          {/* Help text */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-2">
              💡 How to create a valid zone:
            </h5>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Enter a zone name (2-50 characters)</li>
              <li>Add at least 3 points with valid coordinates</li>
              <li>Latitude: between -90 and 90 degrees</li>
              <li>Longitude: between -180 and 180 degrees</li>
              <li>Use decimal format (e.g., 50.123 or 50,123)</li>
              <li>The map will automatically zoom to show your zone</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneForm;