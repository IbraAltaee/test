import React, { useState, useEffect } from "react";
import { Drone } from "@/types/drone";
import DroneService from "@/services/droneService";
import { toast } from "react-toastify";
import { getDroneTypes, getAltitudeOptions } from "@/constants/options";
import DroneOperationService from "@/services/droneOperationService";
import DeleteConfirmation from "@/components/drone management/DeleteDronePopup";
import { FaCheck, FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks/useTranslations";

const SelectedDroneDetails: React.FC<{ drone: Drone; onUpdate: any }> = ({
  drone,
  onUpdate,
}) => {
  const [editableDrone, setEditableDrone] = useState<Drone | undefined>(drone);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [confirmDeleteDrone, setConfirmDeleteDrone] = useState<string | null>(
    null,
  );
  const { token } = useAuth();
  const { droneManagement, common, dashboard, notifications, t } = useTranslations();

  const droneTypes = getDroneTypes(t);
  const altitudeOptions = getAltitudeOptions(t);

  useEffect(() => {
    setEditableDrone(drone);
  }, [drone]);

  const handleChange = (path: string, value: any) => {
    const keys = path.split(".");
    setEditableDrone((prev) => {
      const newDrone = { ...prev } as any;
      let target = newDrone;
      for (let i = 0; i < keys.length - 1; i++) {
        target[keys[i]] = { ...target[keys[i]] };
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return newDrone;
    });
  };

  const handleSave = async () => {
    if (!editableDrone) return;
    if (!token) return;
    try {
      setIsSaving(true);
      await DroneService.updateDrone(editableDrone, drone.name, token);
      toast.success(notifications("droneSavedSuccessfully"));
      setIsEditing(false);
      onUpdate();
      setEditableDrone(undefined);
    } catch (error) {
      console.error("Error saving drone:", error);
      toast.error(notifications("failedToSaveDrone"));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const renderInputField = (
    label: string,
    path: string,
    value: any,
    type = "text",
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) =>
            handleChange(
              path,
              type === "number" ? parseFloat(e.target.value) : e.target.value,
            )
          }
          className="mt-1 border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-blue-500 focus:border-blue-500 transition"
        />
      ) : (
        <p className="mt-1 text-gray-800">{value}</p>
      )}
    </div>
  );

  const renderSelectField = (
    label: string,
    path: string,
    value: any,
    options: { label: string; value: any }[],
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {isEditing ? (
        <select
          value={value ?? ""}
          onChange={(e) => handleChange(path, e.target.value)}
          className="mt-1 border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-blue-500 focus:border-blue-500 transition"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1 text-gray-800">{value}</p>
      )}
    </div>
  );

  return (
    <div className="mt-4 w-full space-y-8">
      {editableDrone && (
        <>
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-3xl font-bold text-gray-800">
              {dashboard("droneDetails")}
            </h3>
            {!isEditing ? (
              <div className="flex space-x-3">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded flex items-center gap-3"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                  <span>{common("edit")}</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded flex items-center gap-3"
                  onClick={() => setConfirmDeleteDrone(editableDrone.name)}
                >
                  <FaTrash />
                  <span>{common("delete")}</span>
                </button>
              </div>
            ) : (
              <div className="space-x-3 flex">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  {common("cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition gap-3 items-center"
                >
                  {isSaving ? <FaSpinner /> : <FaCheck />}
                  {isSaving ? common("saving") : common("save")}
                </button>
              </div>
            )}
          </div>

          {saveMessage && (
            <p className="text-sm text-gray-500 italic">{saveMessage}</p>
          )}

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{dashboard("general")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField(common("name"), "name", editableDrone.name)}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{droneManagement("uavDetails")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                droneManagement("uavType"),
                "uav.type",
                editableDrone.uav.type,
                droneTypes,
              )}
              {renderInputField(
                droneManagement("maxOperationalSpeed"),
                "uav.maxOperationalSpeed",
                editableDrone.uav.maxOperationalSpeed,
                "number",
              )}
              {renderInputField(
                droneManagement("maxUavDimensions"),
                "uav.maxCharacteristicDimension",
                editableDrone.uav.maxCharacteristicDimension,
                "number",
              )}
              {renderSelectField(
                droneManagement("altitudeMeasurementErrorType"),
                "altitudeMeasurementErrorType",
                editableDrone.uav.altitudeMeasurementErrorType,
                altitudeOptions,
              )}
              {renderInputField(
                droneManagement("altitudeMeasurementError"),
                "uav.altitudeMeasurementError",
                editableDrone.uav.altitudeMeasurementError,
                "number",
              )}
              {renderInputField(
                droneManagement("gpsInaccuracy"),
                "uav.gpsInaccuracy",
                editableDrone.uav.gpsInaccuracy,
                "number",
              )}
              {renderInputField(
                droneManagement("positionHoldingError"),
                "uav.positionHoldingError",
                editableDrone.uav.positionHoldingError,
                "number",
              )}
              {renderInputField(
                droneManagement("mapError"),
                "uav.mapError",
                editableDrone.uav.mapError,
                "number",
              )}
              {renderInputField(
                droneManagement("responseTime"),
                "uav.responseTime",
                editableDrone.uav.responseTime,
                "number",
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{droneManagement("lateralContingency")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                droneManagement("contingencyManoeuvre"),
                "lateralContingencyVolume.contingencyManoeuvre",
                editableDrone.lateralContingencyVolume.contingencyManoeuvre,
                DroneOperationService.getLateralContingencyManoeuvres(
                  { value: editableDrone.uav.type },
                  t,
                ),
              )}
              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "TURN_180" &&
                renderInputField(
                  droneManagement("rollAngle"),
                  "rollAngle",
                  editableDrone.lateralContingencyVolume.rollAngle,
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "STOPPING" &&
                renderInputField(
                  droneManagement("pitchAngle"),
                  "pitchAngle",
                  editableDrone.lateralContingencyVolume.pitchAngle,
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "PARACHUTE_TERMINATION" &&
                renderInputField(
                  droneManagement("timeToOpenParachute"),
                  "lateralParachuteTime",
                  editableDrone.lateralContingencyVolume.timeToOpenParachute,
                )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{droneManagement("verticalContingency")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField(
                droneManagement("responseHeight"),
                "verticalContingencyVolume.responseHeight",
                editableDrone.verticalContingencyVolume.responseHeight,
                "number",
              )}
              {renderSelectField(
                droneManagement("contingencyManoeuvre"),
                "verticalContingencyVolume.contingencyManoeuvre",
                editableDrone.verticalContingencyVolume.contingencyManoeuvre,
                DroneOperationService.getVerticalContingencyManoeuvres(
                  { value: editableDrone.uav.type },
                  t,
                ),
              )}
              {editableDrone.verticalContingencyVolume.contingencyManoeuvre ===
                "PARACHUTE_TERMINATION" &&
                editableDrone.lateralContingencyVolume.contingencyManoeuvre !==
                  "PARACHUTE_TERMINATION" &&
                renderInputField(
                  droneManagement("timeToOpenParachute"),
                  "verticalParachuteTime",
                  editableDrone.verticalContingencyVolume.timeToOpenParachute,
                )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{droneManagement("groundRiskBuffer")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                droneManagement("termination"),
                "groundRiskBuffer.termination",
                editableDrone.groundRiskBuffer.termination,
                DroneOperationService.getMethodOfTermination(
                  { value: editableDrone.uav.type },
                  {
                    value:
                      editableDrone.lateralContingencyVolume
                        .contingencyManoeuvre,
                  },
                  {
                    value:
                      editableDrone.verticalContingencyVolume
                        .contingencyManoeuvre,
                  },
                  t,
                ),
              )}
              {editableDrone.groundRiskBuffer.termination === "PARACHUTE" && (
                <>
                  {editableDrone.lateralContingencyVolume
                    .contingencyManoeuvre !== "PARACHUTE_TERMINATION" &&
                    editableDrone.verticalContingencyVolume
                      .contingencyManoeuvre !== "PARACHUTE_TERMINATION" &&
                    renderInputField(
                      droneManagement("timeToOpenParachute"),
                      "grbParachuteTime",
                      editableDrone.groundRiskBuffer.timeToOpenParachute,
                    )}

                  {renderInputField(
                    droneManagement("maxWindSpeed"),
                    "windSpeed",
                    editableDrone.groundRiskBuffer.maxPermissibleWindSpeed,
                  )}
                  {renderInputField(
                    droneManagement("parachuteDescentRate"),
                    "parachuteDescent",
                    editableDrone.groundRiskBuffer.rateOfDescent,
                  )}
                </>
              )}

              {editableDrone.groundRiskBuffer.termination === "OFF_GLIDING" &&
                renderInputField(
                  droneManagement("glideRatio"),
                  "glideRatio",
                  editableDrone.groundRiskBuffer.glideRatio,
                )}
            </div>
          </section>
        </>
      )}
      <DeleteConfirmation
        isOpen={confirmDeleteDrone !== null}
        droneName={confirmDeleteDrone}
        setConfirmDeleteDrone={setConfirmDeleteDrone}
        onUpdate={onUpdate}
        setEditableDrone={setEditableDrone}
      />
    </div>
  );
};

export default SelectedDroneDetails;