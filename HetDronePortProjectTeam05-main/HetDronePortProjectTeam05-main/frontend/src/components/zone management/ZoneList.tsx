"use client";

import React from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Zone } from "@/types/zone";

interface ZoneListProps {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  onViewZone: (zone: Zone) => void;
  onEditZone: (zone: Zone) => void;
  onDeleteZone: (zoneName: string) => void;
  onCreateZone: () => void;
}

const ZoneList: React.FC<ZoneListProps> = ({
  zones,
  loading,
  error,
  onViewZone,
  onEditZone,
  onDeleteZone,
  onCreateZone,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Zone Management</h3>
        <button
          onClick={onCreateZone}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FaPlus /> Create Zone
        </button>
      </div>

      {loading && <div className="text-center py-4">Loading zones...</div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone.name}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {zone.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {zone.path.length}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => onViewZone(zone)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Zone"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEditZone(zone)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit Zone"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDeleteZone(zone.name)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Zone"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {zones.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No zones found. Create your first zone to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneList;
