import { useState, useCallback } from 'react';
import { DroneOperationFormState } from '@/types/droneOperationFormState';

export const useFormHashComparison = () => {
  const [lastSubmittedHash, setLastSubmittedHash] = useState<string | null>(null);

  const generateFormHash = useCallback((formState: DroneOperationFormState): string => {
    const formData = {
      droneType: formState.droneType || '',
      maxOperationalSpeed: formState.maxOperationalSpeed || 0,
      maxUavDimensions: formState.maxUavDimensions || 0,
      altitudeMeasurementErrorType: formState.altitudeMeasurementErrorType || '',
      altitudeMeasurementError: formState.altitudeMeasurementError || 0,
      gpsInaccuracy: formState.gpsInaccuracy || 0,
      positionError: formState.positionError || 0,
      mapError: formState.mapError || 0,
      responseTime: formState.responseTime || 0,
      heightFlight: formState.heightFlight || 0,
      lateralContingencyManoeuvre: formState.lateralContingencyManoeuvre || '',
      rollAngle: formState.rollAngle || 0,
      pitchAngle: formState.pitchAngle || 0,
      lateralParachuteTime: formState.lateralParachuteTime || 0,
      verticalContingencyManoeuvre: formState.verticalContingencyManoeuvre || '',
      verticalParachuteTime: formState.verticalParachuteTime || 0,
      methodOffTermination: formState.methodOffTermination || '',
      grbParachuteTime: formState.grbParachuteTime || 0,
      windSpeed: formState.windSpeed || 0,
      parachuteDescent: formState.parachuteDescent || 0,
      glideRatio: formState.glideRatio || 0,
    };

    return JSON.stringify(formData);
  }, []);

  const isFormChanged = useCallback((currentFormState: DroneOperationFormState): boolean => {
    const currentHash = generateFormHash(currentFormState);
    return currentHash !== lastSubmittedHash;
  }, [lastSubmittedHash, generateFormHash]);

  const markFormAsSubmitted = useCallback((formState: DroneOperationFormState) => {
    const hash = generateFormHash(formState);
    setLastSubmittedHash(hash);
  }, [generateFormHash]);

  return {
    isFormChanged,
    markFormAsSubmitted,
    hasLastSubmission: lastSubmittedHash !== null,
  };
};
