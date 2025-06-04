import { DeleteDroneConfirmationProps } from "@/types/drone";
import DroneService from "@/services/droneService";
import { toast } from "react-toastify";
import { useAuth } from "@/providers/AuthProvider";

const DeleteConfirmation: React.FC<DeleteDroneConfirmationProps> = ({
  isOpen,
  droneName,
  onUpdate,
  setConfirmDeleteDrone,
  setEditableDrone,
}) => {
  if (!isOpen || !droneName) return null;
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!droneName) return;
    if (!token) return;

    try {
      const res = await DroneService.deleteDrone(droneName, token);
      toast.success("Drone deleted successfully!");
      setConfirmDeleteDrone(null);
      onUpdate();
      setEditableDrone(undefined);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete drone";
      console.error("Error deleting drone:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete this drone: "{droneName}"? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={() => setConfirmDeleteDrone(null)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
