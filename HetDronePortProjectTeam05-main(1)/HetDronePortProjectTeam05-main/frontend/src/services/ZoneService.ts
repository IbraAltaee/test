import { Zone } from "@/types/zone";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/zones`;

export const zoneService = {
  async getAllZones(): Promise<Zone[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch zones: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching zones:", error);
      throw error;
    }
  },

  async createZone(zone: Zone, token: String): Promise<Zone> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zone),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to create zone: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating zone:", error);
      throw error;
    }
  },

  async updateZone(zoneName: string, zone: Zone, token: String): Promise<Zone> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${zoneName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zone),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update zone: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating zone:", error);
      throw error;
    }
  },

  async deleteZone(zoneName: string, token: String): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${zoneName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete zone: ${response.status}`,
        );
      }
      return await response.text();
    } catch (error) {
      console.error("Error deleting zone:", error);
      throw error;
    }
  },

  async getZonesGreaterThanMaxHeight(maxHeight: number): Promise<Zone[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/${maxHeight}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch zones: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching zones:", error);
      throw error;
    }
  },
};
