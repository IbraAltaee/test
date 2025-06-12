import { ApiClient } from "@/utils/apiClient";
import { Zone } from "@/types/zone";

export const zoneService = {
  async getAllZones(): Promise<Zone[]> {
    return ApiClient.get<Zone[]>("/zones");
  },

  async createZone(zone: Zone): Promise<Zone> {
    return ApiClient.post<Zone>("/zones/admin", zone);
  },

  async updateZone(zoneName: string, zone: Zone): Promise<Zone> {
    return ApiClient.put<Zone>(`/zones/admin/${encodeURIComponent(zoneName)}`, zone);
  },

  async deleteZone(zoneName: string): Promise<void> {
    return ApiClient.delete<void>(`/zones/admin/${encodeURIComponent(zoneName)}`);
  },

  async getZone(zoneName: string): Promise<Zone> {
    return ApiClient.get<Zone>(`/zones/${encodeURIComponent(zoneName)}`);
  },

  async getZonesGreaterThanMaxHeight(maxHeight: number) {
    return ApiClient.get<Zone[]>(`/zones/maxHeight/${maxHeight}`);

  }
};