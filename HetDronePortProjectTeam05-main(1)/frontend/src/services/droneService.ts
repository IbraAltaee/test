import { ApiClient } from "@/utils/apiClient";
import { Drone } from "@/types/drone";

export const droneService = {
  async getAllDrones(): Promise<Drone[]> {
    return ApiClient.get<Drone[]>("/drones");
  },

  async createDrone(drone: Drone): Promise<Drone> {
    return ApiClient.post<Drone>("/drones/admin", drone);
  },

  async updateDrone(droneName: string, drone: Drone): Promise<Drone> {
    return ApiClient.put<Drone>(`/drones/admin/${encodeURIComponent(droneName)}`, drone);
  },

  async deleteDrone(droneName: string): Promise<void> {
    return ApiClient.delete<void>(`/drones/admin/${encodeURIComponent(droneName)}`);
  }
};