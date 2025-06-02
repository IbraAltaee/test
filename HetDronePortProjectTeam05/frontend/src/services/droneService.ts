import {Drone} from "@/types/drone";

const API_BASE_URL = "http://localhost:8080/api";

const fetchDrones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/drones`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data: Drone[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const updateDrone = async (drone: Drone, oldName:String, token:String) => {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/admin/${oldName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(drone),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const createDrone = async (drone: Drone, token:String) => {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(drone),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const deleteDrone = async (droneName: string, token:String) => {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/admin/${droneName}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete drone");
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: true, message: error.message };
        } else {
            return { error: true, message: "Unknown error occurred" };
        }
    }
};


const droneService = {
    fetchDrones,
    updateDrone,
    createDrone,
    deleteDrone,
}

export default droneService;