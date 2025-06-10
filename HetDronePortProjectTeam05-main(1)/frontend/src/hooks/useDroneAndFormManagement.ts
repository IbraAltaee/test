"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import DroneService from "@/services/droneService";
import ExportService from "@/services/exportService";
import { Drone } from "@/types/drone";
import { OptionType } from "@/types/optionType";
import {
  DroneOperationFormState,
  FormDataValues,
  initialDataValues,
} from "@/types/droneOperationFormState";
import { useAuth } from "@/providers/AuthProvider";
import { getDroneTypes } from "@/constants/options";
import InternalDroneOperationService from "@/services/droneOperationService";
import { useTranslations } from "@/hooks/useTranslations";

type UseDroneAndFormManagementProps = {
  setFormErrors: React.Dispatch<React.SetStateAction<any[]>>;
  setDroneTypeState: (value: OptionType | null) => void;
  setLateralContingencyManoeuvreState: (value: OptionType | null) => void;
  setVerticalContingencyManoeuvreState: (value: OptionType | null) => void;
  setMethodOffTerminationState: (value: OptionType | null) => void;
  setAltitudeMeasurementErrorTypeState: (
    value: "barometric" | "GPS-based" | null,
  ) => void;
  setFormDataState: React.Dispatch<React.SetStateAction<FormDataValues>>;
  isFormInputValid: (isExport: boolean) => boolean;
  buildFormStateObject: () => DroneOperationFormState;
};

export const useDroneAndFormManagement = ({
  setFormErrors,
  setDroneTypeState,
  setLateralContingencyManoeuvreState,
  setVerticalContingencyManoeuvreState,
  setMethodOffTerminationState,
  setAltitudeMeasurementErrorTypeState,
  setFormDataState,
  isFormInputValid,
  buildFormStateObject,
}: UseDroneAndFormManagementProps) => {
  const { username, token } = useAuth();
  const { notifications, validation, t } = useTranslations();
  
  const [drones, setDrones] = useState<Drone[]>([]);
  const [availableDrones, setAvailableDrones] = useState<OptionType[]>([]);
  const [selectedDroneOption, setSelectedDroneOption] =
    useState<OptionType | null>(null);
  const [configName, setConfigName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchDronesAsync = async () => {
      try {
        const fetchedDrones = await DroneService.fetchDrones();
        setDrones(fetchedDrones);
        setAvailableDrones(
          fetchedDrones.map((d) => ({ value: d.name, label: d.name })),
        );
      } catch (error) {
        console.error("Failed to fetch drones:", error);
        toast.error("Could not load saved drone configurations.");
      }
    };
    fetchDronesAsync();
  }, []);

  const mapDroneToFormState = useCallback(
    (drone: Drone): DroneOperationFormState => ({
      droneType: drone.uav.type,
      lateralContingencyManoeuvre:
        drone.lateralContingencyVolume.contingencyManoeuvre,
      verticalContingencyManoeuvre:
        drone.verticalContingencyVolume.contingencyManoeuvre,
      methodOffTermination: drone.groundRiskBuffer.termination,
      maxOperationalSpeed: drone.uav.maxOperationalSpeed,
      maxUavDimensions: drone.uav.maxCharacteristicDimension,
      altitudeMeasurementErrorType: drone.uav.altitudeMeasurementErrorType,
      altitudeMeasurementError: drone.uav.altitudeMeasurementError,
      gpsInaccuracy: drone.uav.gpsInaccuracy,
      positionError: drone.uav.positionHoldingError,
      mapError: drone.uav.mapError,
      responseTime: drone.uav.responseTime,
      heightFlight: drone.maxFlightAltitude,
      heightFlightFt:
        drone.maxFlightAltitude !== undefined
          ? Number((drone.maxFlightAltitude / 0.3048).toFixed(2))
          : undefined,
      rollAngle: drone.lateralContingencyVolume.rollAngle,
      pitchAngle: drone.lateralContingencyVolume.pitchAngle,
      lateralParachuteTime:
        drone.lateralContingencyVolume.timeToOpenParachute || undefined,
      responseHeight: drone.verticalContingencyVolume.responseHeight,
      verticalParachuteTime:
        drone.verticalContingencyVolume.timeToOpenParachute || undefined,
      grbParachuteTime: drone.groundRiskBuffer.timeToOpenParachute || undefined,
      windSpeed: drone.groundRiskBuffer.maxPermissibleWindSpeed || undefined,
      parachuteDescent: drone.groundRiskBuffer.rateOfDescent || undefined,
      glideRatio: drone.groundRiskBuffer.glideRatio || undefined,
    }),
    [],
  );

  const validateImportedData = (
    importedData: any,
  ): importedData is DroneOperationFormState => {
    if (typeof importedData !== "object" || importedData === null) return false;
    const droneTypes = getDroneTypes(t);
    return !(
      importedData.droneType &&
      !droneTypes.some((dt) => dt.value === importedData.droneType)
    );
  };

  const loadFormStateFromDroneOperation = useCallback(
    (importedState: DroneOperationFormState) => {
      if (!validateImportedData(importedState)) {
        toast.error(notifications("invalidConfigurationFile"));
        return;
      }
      
      const droneTypes = getDroneTypes(t);
      const newDroneTypeOpt =
        droneTypes.find((dt) => dt.value === importedState.droneType) || null;
      setDroneTypeState(newDroneTypeOpt);
      setAltitudeMeasurementErrorTypeState(
        importedState.altitudeMeasurementErrorType,
      );

      const newFormData: Partial<FormDataValues> = {};
      (Object.keys(initialDataValues) as Array<keyof FormDataValues>).forEach(
        (key) => {
          const formStateKey = key as keyof DroneOperationFormState;
          if (
            Object.prototype.hasOwnProperty.call(importedState, formStateKey)
          ) {
            const valueFromImport = importedState[formStateKey];
            if (
              typeof valueFromImport === "number" ||
              valueFromImport === undefined ||
              valueFromImport === null
            ) {
              newFormData[key] =
                valueFromImport === null ? undefined : valueFromImport;
            }
          }
        },
      );
      const completeNewFormData = { ...initialDataValues, ...newFormData };

      if (importedState.heightFlight !== undefined) {
        completeNewFormData.heightFlightFt = Number(
          (importedState.heightFlight / 0.3048).toFixed(2),
        );
      } else if (importedState.heightFlightFt !== undefined) {
        completeNewFormData.heightFlight = Number(
          (importedState.heightFlightFt * 0.3048).toFixed(2),
        );
      }

      setFormDataState((prev) => {
        const updated = { ...prev, ...completeNewFormData };
        if (JSON.stringify(prev) === JSON.stringify(updated)) return prev;
        return updated;
      });

      const latOptions =
        InternalDroneOperationService.getLateralContingencyManoeuvres(
          newDroneTypeOpt,
          t,
        );
      setLateralContingencyManoeuvreState(
        latOptions.find(
          (lo) => lo.value === importedState.lateralContingencyManoeuvre,
        ) || null,
      );

      const vertOptions =
        InternalDroneOperationService.getVerticalContingencyManoeuvres(
          newDroneTypeOpt,
          t,
        );
      setVerticalContingencyManoeuvreState(
        vertOptions.find(
          (vo) => vo.value === importedState.verticalContingencyManoeuvre,
        ) || null,
      );

      const methodOptions =
        InternalDroneOperationService.getMethodOfTermination(
          newDroneTypeOpt,
          latOptions.find(
            (lo) => lo.value === importedState.lateralContingencyManoeuvre,
          ) || null,
          vertOptions.find(
            (vo) => vo.value === importedState.verticalContingencyManoeuvre,
          ) || null,
          t,
        );
      setMethodOffTerminationState(
        methodOptions.find(
          (mo) => mo.value === importedState.methodOffTermination,
        ) || null,
      );

      setFormErrors([]);
      toast.success(notifications("configurationImportedSuccessfully"));
    },
    [
      setDroneTypeState,
      setAltitudeMeasurementErrorTypeState,
      setFormDataState,
      setLateralContingencyManoeuvreState,
      setVerticalContingencyManoeuvreState,
      setMethodOffTerminationState,
      setFormErrors,
      notifications,
      t,
    ],
  );

  const handleLoadSelectedDrone = useCallback(() => {
    const selectedDroneData = drones.find(
      (d) => d.name === selectedDroneOption?.value,
    );
    if (selectedDroneData) {
      const formState = mapDroneToFormState(selectedDroneData);
      loadFormStateFromDroneOperation(formState);
      setConfigName(selectedDroneData.name);
    }
  }, [
    drones,
    selectedDroneOption,
    mapDroneToFormState,
    loadFormStateFromDroneOperation,
  ]);

  const handleExport = useCallback(() => {
    if (!isFormInputValid(true)) {
      toast.error(validation("fillRequiredFields"));
      return;
    }
    const currentFormState = buildFormStateObject();
    ExportService.exportDroneFormConfig(
      currentFormState,
      `drone_form_config_${new Date().toISOString()}.json`,
    );
    toast.success(notifications("configurationExportedSuccessfully"));
  }, [isFormInputValid, buildFormStateObject, validation, notifications]);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedState = JSON.parse(content) as DroneOperationFormState;
          loadFormStateFromDroneOperation(importedState);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          toast.error(notifications("failedToParseConfiguration"));
        }
      };
      reader.readAsText(file);
      if (event.target) event.target.value = "";
    },
    [loadFormStateFromDroneOperation, notifications],
  );

  const handleSave = useCallback(async () => {
    if (!username || !token) {
      toast.error(validation("pleaseLoginToSave"));
      return;
    }
    if (!isFormInputValid(false)) {
      toast.error(validation("fillRequiredFields"));
      return;
    }
    if (!configName) {
      toast.error(validation("provideName"));
      return;
    }

    if (availableDrones.some(item => item.value === configName)) {
      toast.error("Configuration name already used");
      return;
    }

    const formState = buildFormStateObject();
    const droneConfig: Drone = {
      name: configName,
      uav: {
        type: (formState.droneType as Drone["uav"]["type"]) || "MULTIROTOR",
        maxOperationalSpeed: formState.maxOperationalSpeed ?? 0,
        maxCharacteristicDimension: formState.maxUavDimensions ?? 0,
        altitudeMeasurementErrorType:
          formState.altitudeMeasurementErrorType ?? "barometric",
        altitudeMeasurementError: formState.altitudeMeasurementError ?? 0,
        gpsInaccuracy: formState.gpsInaccuracy ?? 0,
        positionHoldingError: formState.positionError ?? 0,
        mapError: formState.mapError ?? 0,
        responseTime: formState.responseTime ?? 0,
      },
      lateralContingencyVolume: {
        contingencyManoeuvre:
          (formState.lateralContingencyManoeuvre as Drone["lateralContingencyVolume"]["contingencyManoeuvre"]) ||
          "NO_MANOEUVRE",
        rollAngle: formState.rollAngle ?? 0,
        pitchAngle: formState.pitchAngle ?? 0,
        timeToOpenParachute: formState.lateralParachuteTime ?? 0,
      },
      verticalContingencyVolume: {
        contingencyManoeuvre:
          (formState.verticalContingencyManoeuvre as Drone["verticalContingencyVolume"]["contingencyManoeuvre"]) ||
          "NO_MANOEUVRE",
        timeToOpenParachute: formState.verticalParachuteTime ?? 0,
        responseHeight: formState.responseHeight ?? 0,
      },
      groundRiskBuffer: {
        termination:
          (formState.methodOffTermination as Drone["groundRiskBuffer"]["termination"]) ||
          "NO_TERMINATION",
        timeToOpenParachute: formState.grbParachuteTime ?? 0,
        maxPermissibleWindSpeed: formState.windSpeed ?? 0,
        rateOfDescent: formState.parachuteDescent ?? 0,
        glideRatio: formState.glideRatio ?? 0,
      },
      maxFlightAltitude: formState.heightFlight ?? 0,
    };

    setIsProcessing(true);
    try {
      await DroneService.createDrone(droneConfig, token);
      toast.success(notifications("configurationSavedSuccessfully"));
      const fetchedDrones = await DroneService.fetchDrones();
      setDrones(fetchedDrones);
      setAvailableDrones(
        fetchedDrones.map((d) => ({ value: d.name, label: d.name })),
      );
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error(
        `${notifications("failedToSaveConfiguration")}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  }, [username, token, isFormInputValid, configName, buildFormStateObject, validation, notifications]);

  return {
    availableDrones,
    selectedDroneOption,
    setSelectedDroneOption,
    configName,
    setConfigName,
    fileInputRef,
    isProcessing,
    handleLoadSelectedDrone,
    handleExport,
    handleImportClick,
    handleFileChange,
    handleSave,
  };
};