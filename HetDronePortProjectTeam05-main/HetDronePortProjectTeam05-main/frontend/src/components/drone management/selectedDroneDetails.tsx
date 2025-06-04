import React, { useState, useEffect } from "react";
import { Drone } from "@/types/drone";
import DroneService from "@/services/droneService";
import { toast } from "react-toastify";
import { droneTypes, altitudeOptions } from "@/constants/options";
import DroneOperationService from "@/services/droneOperationService";
import DeleteConfirmation from "@/components/drone management/DeleteDronePopup";
import { FaCheck, FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider";

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
      toast.success("Drone saved successfully!");
      setIsEditing(false);
      onUpdate();
      setEditableDrone(undefined);
    } catch (error) {
      console.error("Error saving drone:", error);
      toast.error("Failed to save drone.");
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
            <h3 className="text-3xl font-bold text-gray-800">Drone Details</h3>
            {!isEditing ? (
              <div className="flex space-x-3">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded flex items-center gap-3"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded flex items-center gap-3"
                  onClick={() => setConfirmDeleteDrone(editableDrone.name)}
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            ) : (
              <div className="space-x-3 flex">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition gap-3 items-center"
                >
                  {isSaving ? <FaSpinner /> : <FaCheck />}
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {saveMessage && (
            <p className="text-sm text-gray-500 italic">{saveMessage}</p>
          )}

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField("Name:", "name", editableDrone.name)}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">UAV Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                "UAV Type:",
                "uav.type",
                editableDrone.uav.type,
                droneTypes,
              )}
              {renderInputField(
                "Max Operational Speed (m/s):",
                "uav.maxOperationalSpeed",
                editableDrone.uav.maxOperationalSpeed,
                "number",
              )}
              {renderInputField(
                "Max UAV Dimensions (m):",
                "uav.maxCharacteristicDimension",
                editableDrone.uav.maxCharacteristicDimension,
                "number",
              )}
              {renderSelectField(
                "Altitude measurement error type",
                "altitudeMeasurementErrorType",
                editableDrone.uav.altitudeMeasurementErrorType,
                altitudeOptions,
              )}
              {renderInputField(
                "Altitude Measurement Error (m):",
                "uav.altitudeMeasurementError",
                editableDrone.uav.altitudeMeasurementError,
                "number",
              )}
              {renderInputField(
                "GPS Inaccuracy (m):",
                "uav.gpsInaccuracy",
                editableDrone.uav.gpsInaccuracy,
                "number",
              )}
              {renderInputField(
                "Position Holding Error (m):",
                "uav.positionHoldingError",
                editableDrone.uav.positionHoldingError,
                "number",
              )}
              {renderInputField(
                "Map Error (m):",
                "uav.mapError",
                editableDrone.uav.mapError,
                "number",
              )}
              {renderInputField(
                "Response Time (s):",
                "uav.responseTime",
                editableDrone.uav.responseTime,
                "number",
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Lateral Contingency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                "Contingency Manoeuvre:",
                "lateralContingencyVolume.contingencyManoeuvre",
                editableDrone.lateralContingencyVolume.contingencyManoeuvre,
                DroneOperationService.getLateralContingencyManoeuvres({
                  value: editableDrone.uav.type,
                }),
              )}
              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "TURN_180" &&
                renderInputField(
                  "Roll angle (°)",
                  "rollAngle",
                  editableDrone.lateralContingencyVolume.rollAngle,
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "STOPPING" &&
                renderInputField(
                  "Pitch angle (°)",
                  "pitchAngle",
                  editableDrone.lateralContingencyVolume.pitchAngle,
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "PARACHUTE_TERMINATION" &&
                renderInputField(
                  "Time to open parachute (s)",
                  "lateralParachuteTime",
                  editableDrone.lateralContingencyVolume.timeToOpenParachute,
                )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Vertical Contingency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField(
                "Response Height (m):",
                "verticalContingencyVolume.responseHeight",
                editableDrone.verticalContingencyVolume.responseHeight,
                "number",
              )}
              {renderSelectField(
                "Contingency Manoeuvre:",
                "verticalContingencyVolume.contingencyManoeuvre",
                editableDrone.verticalContingencyVolume.contingencyManoeuvre,
                DroneOperationService.getVerticalContingencyManoeuvres({
                  value: editableDrone.uav.type,
                }),
              )}
              {editableDrone.verticalContingencyVolume.contingencyManoeuvre ===
                "PARACHUTE_TERMINATION" &&
                editableDrone.lateralContingencyVolume.contingencyManoeuvre !==
                  "PARACHUTE_TERMINATION" &&
                renderInputField(
                  "Time to open parachute (s)",
                  "verticalParachuteTime",
                  editableDrone.verticalContingencyVolume.timeToOpenParachute,
                )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Ground Risk Buffer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField(
                "Termination:",
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
                ),
              )}
              {editableDrone.groundRiskBuffer.termination === "PARACHUTE" && (
                <>
                  {editableDrone.lateralContingencyVolume
                    .contingencyManoeuvre !== "PARACHUTE_TERMINATION" &&
                    editableDrone.verticalContingencyVolume
                      .contingencyManoeuvre !== "PARACHUTE_TERMINATION" &&
                    renderInputField(
                      "Time to open parachute (s)",
                      "grbParachuteTime",
                      editableDrone.groundRiskBuffer.timeToOpenParachute,
                    )}

                  {renderInputField(
                    "Max wind speed (m/s)",
                    "windSpeed",
                    editableDrone.groundRiskBuffer.maxPermissibleWindSpeed,
                  )}
                  {renderInputField(
                    "Parachute descent rate (m/s)",
                    "parachuteDescent",
                    editableDrone.groundRiskBuffer.rateOfDescent,
                  )}
                </>
              )}

              {editableDrone.groundRiskBuffer.termination === "OFF_GLIDING" &&
                renderInputField(
                  "Glide ratio",
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
