import React, { useEffect, useState } from "react";
import { Drone } from "@/types/drone";
import { droneService } from "@/services/droneService";
import { SelectField } from "@/components/selectField";
import SelectedDroneDetails from "@/components/drone management/selectedDroneDetails";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "@/hooks/useTranslations";

const DroneTable: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDroneName, setSelectedDroneName] = useState<string | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  const router = useRouter();
  const { dashboard } = useTranslations();

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setLoading(true);
        // Updated to use new droneService
        const dronesData: Drone[] = await droneService.getAllDrones();
        setDrones(dronesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch drones:", err);
        setError("Failed to fetch drones");
      } finally {
        setLoading(false);
      }
    };

    fetchDrones();
  }, []);

  useEffect(() => {
    if (selectedDroneName) {
      const drone = drones.find((drone) => drone.name === selectedDroneName) || null;
      setSelectedDrone(drone);
    }
  }, [selectedDroneName, drones]);

  const handleAddClick = () => {
    router.push("/");
  };

  const handleRefresh = async () => {
    setSelectedDroneName(null);
    setSelectedDrone(null);
    setLoading(true);
    
    try {
      const fetched = await droneService.getAllDrones();
      setDrones(fetched);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh drones:", err);
      setError("Failed to fetch drones");
    } finally {
      setLoading(false);
    }
  };

  const options = drones.map((drone) => ({
    label: drone.name,
    value: drone.name,
  }));

  const selectedOption = options.find((option) => option.value === selectedDroneName) || null;

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{dashboard("droneManagement")}</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleAddClick}
        >
          <FaPlus />
          {dashboard("createDrone")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-md">
          <SelectField
            label={dashboard("selectADrone")}
            value={selectedOption}
            onChange={(option) =>
              setSelectedDroneName(option ? option.value : null)
            }
            options={options}
            name="drone"
            getFieldError={() => undefined}
          />
        </div>

        {loading && (
          <div className="text-center py-4">{dashboard("loadingDrones")}</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {selectedDrone && (
          <SelectedDroneDetails
            drone={selectedDrone}
            onUpdate={handleRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default DroneTable;