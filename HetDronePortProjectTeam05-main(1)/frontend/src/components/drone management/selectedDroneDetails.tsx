import DeleteConfirmation from "@/components/drone management/DeleteDronePopup";
import { getAltitudeOptions, getDroneTypes } from "@/constants/options";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/providers/AuthProvider";
import DroneOperationService from "@/services/droneOperationService";
import { droneService } from "@/services/droneService";
import { Drone } from "@/types/drone";
import React, { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const SelectedDroneDetails: React.FC<{ drone: Drone; onUpdate: any }> = ({
  drone,
  onUpdate,
}) => {
  const [editableDrone, setEditableDrone] = useState<Drone | undefined>(drone);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [confirmDeleteDrone, setConfirmDeleteDrone] = useState<string | null>(null);
  

  const { isAuthenticated } = useAuth();
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
    if (!isAuthenticated) {
      toast.error("Please log in to save changes");
      return;
    }
    
    try {
      setIsSaving(true);
      // Updated to use new droneService without token
      await droneService.updateDrone(drone.name, editableDrone);
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
          disabled={!isAuthenticated}
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
          disabled={!isAuthenticated}
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsEditing(true)}
                  disabled={!isAuthenticated}
                >
                  <FaEdit />
                  <span>{common("edit")}</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setConfirmDeleteDrone(editableDrone.name)}
                  disabled={!isAuthenticated}
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
                  disabled={isSaving || !isAuthenticated}
                  className="flex px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition gap-3 items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <FaSpinner /> : <FaCheck />}
                  {isSaving ? common("saving") : common("save")}
                </button>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
              Please log in to edit or delete drones.
            </div>
          )}

          {saveMessage && (
            <p className="text-sm text-gray-500 italic">{saveMessage}</p>
          )}

          {/* Rest of the component remains the same - all the sections */}
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
                  "lateralContingencyVolume.rollAngle",
                  editableDrone.lateralContingencyVolume.rollAngle,
                  "number",
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "STOPPING" &&
                renderInputField(
                  droneManagement("pitchAngle"),
                  "lateralContingencyVolume.pitchAngle",
                  editableDrone.lateralContingencyVolume.pitchAngle,
                  "number",
                )}

              {editableDrone.lateralContingencyVolume.contingencyManoeuvre ===
                "PARACHUTE_TERMINATION" &&
                renderInputField(
                  droneManagement("timeToOpenParachute"),
                  "lateralContingencyVolume.timeToOpenParachute",
                  editableDrone.lateralContingencyVolume.timeToOpenParachute,
                  "number",
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
                  "verticalContingencyVolume.timeToOpenParachute",
                  editableDrone.verticalContingencyVolume.timeToOpenParachute,
                  "number"
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
                      "groundRiskBuffer.timeToOpenParachute",
                      editableDrone.groundRiskBuffer.timeToOpenParachute,
                      "number",
                    )}

                  {renderInputField(
                    droneManagement("maxWindSpeed"),
                    "groundRiskBuffer.maxPermissibleWindSpeed",
                    editableDrone.groundRiskBuffer.maxPermissibleWindSpeed,
                    "number",
                  )}
                  {renderInputField(
                    droneManagement("parachuteDescentRate"),
                    "groundRiskBuffer.rateOfDescent",
                    editableDrone.groundRiskBuffer.rateOfDescent,
                    "number",
                  )}
                </>
              )}

              {editableDrone.groundRiskBuffer.termination === "OFF_GLIDING" &&
                renderInputField(
                  droneManagement("glideRatio"),
                  "groundRiskBuffer.glideRatio",
                  editableDrone.groundRiskBuffer.glideRatio,
                  "number",
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