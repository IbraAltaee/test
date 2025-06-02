// components/ZoneView.tsx
'use client';

import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Zone } from '@/types/zone';
import PointList from './PointList';
import ZoneMap from './ZoneMap';


interface ZoneViewProps {
  zone: Zone;
  onBack: () => void;
}

const ZoneView: React.FC<ZoneViewProps> = ({ zone, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft />
            </button>
            <h3 className="text-xl font-semibold">View Zone: {zone.name}</h3>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Points */}
            <div className="bg-white p-6 rounded-lg shadow">
              <PointList zone={zone} editable={false} />
            </div>

            {/* Right column - Map */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Map Preview</h4>
              <ZoneMap zone={zone} mapId={`view-${zone.name}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneView;