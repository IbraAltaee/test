'use client';

import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { zoneService } from '@/services/ZoneService';
import { Zone } from '@/types/zone';
import { toast } from 'react-toastify';
import ZoneList from './zone management/ZoneList';
import ZoneView from './zone management/ZoneView';
import ZoneForm from './zone management/ZoneForm';
import DeleteConfirmationModal from './zone management/DeleteConfirmationModal';
import { useState, useEffect } from 'react';
import DroneTable from "@/components/drone management/droneTable";

type ViewMode = 'list' | 'view' | 'edit' | 'create';
type TabMode = 'drones' | 'zones';
import { useAuth } from '@/providers/AuthProvider';

const AdminDashboard: React.FC = () => {
  // Main navigation state
  const [activeTab, setActiveTab] = useState<TabMode>('zones');
  const [currentView, setCurrentView] = useState<ViewMode>('list');

  // Data state
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zone operation state
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [formZone, setFormZone] = useState<Zone>({ name: '', path: [] });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { token } = useAuth();

  // Load zones when needed
  useEffect(() => {
    if (activeTab === 'zones' && currentView === 'list') {
      loadZones();
    }
  }, [activeTab, currentView]);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedZones = await zoneService.getAllZones();
      setZones(fetchedZones);
    } catch (err: any) {
      const errorMsg = 'Failed to load zones';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validateZone = (zone: Zone): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate name
    if (!zone.name.trim()) {
      errors.push('Zone name is required');
    } else if (zone.name.trim().length < 2) {
      errors.push('Zone name must be at least 2 characters');
    } else if (zone.name.trim().length > 50) {
      errors.push('Zone name must not exceed 50 characters');
    }

    // Validate points
    const validPoints = zone.path.filter(point =>
      point.lat !== null && point.lng !== null &&
      typeof point.lat === 'number' && typeof point.lng === 'number' &&
      !isNaN(point.lat) && !isNaN(point.lng) &&
      point.lat >= -90 && point.lat <= 90 &&
      point.lng >= -180 && point.lng <= 180 &&
      !(point.lat === 0 && point.lng === 0) // Exclude (0,0) coordinates
    );

    if (validPoints.length < 3) {
      errors.push(`At least 3 valid points are required (currently: ${validPoints.length})`);
    }

    // Check for incomplete points
    const incompletePoints = zone.path.filter(point =>
      (point.lat === null && point.lng !== null) ||
      (point.lat !== null && point.lng === null)
    );

    if (incompletePoints.length > 0) {
      errors.push(`${incompletePoints.length} incomplete point${incompletePoints.length > 1 ? 's' : ''} found`);
    }

    // Check for default coordinates (0,0)
    const defaultPoints = zone.path.filter(point =>
      point.lat === 0 || point.lng === 0
    );

    if (defaultPoints.length > 0) {
        toast.error(`${defaultPoints.length} point${defaultPoints.length > 1 ? 's' : ''} cannot be at coordinates (0,0)`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Navigation handlers
  const handleViewZone = (zone: Zone) => {
    setSelectedZone(zone);
    setCurrentView('view');
    setError(null);
  };

  const handleEditZone = (zone: Zone) => {
    setSelectedZone(zone);
    setFormZone({ ...zone });
    setCurrentView('edit');
    setError(null);
  };

  const handleCreateZone = () => {
    setFormZone({ name: '', path: [] });
    setCurrentView('create');
    setError(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedZone(null);
    setFormZone({ name: '', path: [] });
    setError(null);
  };

  // CRUD operations
  const handleSaveZone = async () => {
    if (!token) return;
    const validation = validateZone(formZone);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      if (currentView === 'create') {
        await zoneService.createZone(formZone, token);
        toast.success('Zone created successfully!');
      } else if (currentView === 'edit' && selectedZone) {
        await zoneService.updateZone(selectedZone.name, formZone, token);
        toast.success('Zone updated successfully!');
      }

      handleBackToList();
    } catch (err: any) {
      const errorMsg = err.message || `Failed to ${currentView} zone`;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async () => {
    if (!deleteTarget) return;
    if (!token) return;
    
    try {
      setLoading(true);
      await zoneService.deleteZone(deleteTarget, token);
      setDeleteTarget(null);
      await loadZones();
      toast.success('Zone deleted successfully!');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete zone';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Render based on current view
  if (currentView === 'view' && selectedZone) {
    return <ZoneView zone={selectedZone} onBack={handleBackToList} />;
  }

  if ((currentView === 'edit' || currentView === 'create')) {
    return (
      <ZoneForm
        mode={currentView}
        zone={formZone}
        originalZoneName={selectedZone?.name}
        loading={loading}
        error={error}
        onZoneChange={setFormZone}
        onSave={handleSaveZone}
        onCancel={handleBackToList}
      />
    );
  }

  // Main dashboard view
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

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('drones')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'drones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Drone Management
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'zones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Zone Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'drones' && (
          <DroneTable/>
        )}

        {activeTab === 'zones' && (
          <ZoneList
            zones={zones}
            loading={loading}
            error={error}
            onViewZone={handleViewZone}
            onEditZone={handleEditZone}
            onDeleteZone={setDeleteTarget}
            onCreateZone={handleCreateZone}
          />
        )}
      </div>


      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        zoneName={deleteTarget || ''}
        loading={loading}
        onConfirm={handleDeleteZone}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminDashboard;