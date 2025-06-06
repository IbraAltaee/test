"use client";

import { zoneService } from "@/services/ZoneService";
import { Zone } from "@/types/zone";
import { toast } from "react-toastify";
import ZoneList from "./zone management/ZoneList";
import ZoneView from "./zone management/ZoneView";
import ZoneForm from "./zone management/ZoneForm";
import DeleteConfirmationModal from "./zone management/DeleteConfirmationModal";
import React, { useState, useEffect } from "react";
import DroneTable from "@/components/drone management/droneTable";
import { useAuth } from "@/providers/AuthProvider";
import EmailConfig from "./email configuration/EmailConfig";
import { useTranslations } from "@/hooks/useTranslations";

type ViewMode = "list" | "view" | "edit" | "create";
type TabMode = "drones" | "zones" | "email-config";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("zones");
  const [currentView, setCurrentView] = useState<ViewMode>("list");

  // Data state
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zone operation state
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [formZone, setFormZone] = useState<Zone>({
    name: "",
    path: [],
    maxHeight: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { token } = useAuth();
  const { dashboard, notifications, validation, emailConfig } = useTranslations();

  useEffect(() => {
    if (activeTab === "zones" && currentView === "list") {
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
      const errorMsg = notifications("failedToLoadZones");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validateZone = (zone: Zone): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!zone.name.trim()) {
      errors.push(validation("zoneNameRequired"));
    } else if (zone.name.trim().length < 2) {
      errors.push(validation("zoneNameMinLength"));
    } else if (zone.name.trim().length > 50) {
      errors.push(validation("zoneNameMaxLength"));
    }

    const validPoints = zone.path.filter(
      (point) =>
        point.lat !== null &&
        point.lng !== null &&
        !isNaN(point.lat) &&
        !isNaN(point.lng) &&
        point.lat >= -90 &&
        point.lat <= 90 &&
        point.lng >= -180 &&
        point.lng <= 180 &&
        !(point.lat === 0 && point.lng === 0),
    );

    if (validPoints.length < 3) {
      errors.push(validation("atLeast3ValidPointsRequired", { count: validPoints.length }));
    }

    const incompletePoints = zone.path.filter(
      (point) =>
        (point.lat === null && point.lng !== null) ||
        (point.lat !== null && point.lng === null),
    );

    if (incompletePoints.length > 0) {
      incompletePoints.forEach((_, index) => {
        errors.push(validation("pointIncomplete", { index: index + 1 }));
      });
    }

    const defaultPoints = zone.path.filter(
      (point) => point.lat === 0 || point.lng === 0,
    );

    if (defaultPoints.length > 0) {
      defaultPoints.forEach((_, index) => {
        errors.push(validation("pointCannotBe00", { index: index + 1 }));
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleViewZone = (zone: Zone) => {
    setSelectedZone(zone);
    setCurrentView("view");
    setError(null);
  };

  const handleEditZone = (zone: Zone) => {
    setSelectedZone(zone);
    setFormZone({ ...zone });
    setCurrentView("edit");
    setError(null);
  };

  const handleCreateZone = () => {
    setFormZone({ name: "", path: [], maxHeight: null });
    setCurrentView("create");
    setError(null);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedZone(null);
    setFormZone({ name: "", path: [], maxHeight: null });
    setError(null);
  };

  const handleSaveZone = async () => {
    if (!token) return;
    const validation = validateZone(formZone);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (currentView === "create") {
        await zoneService.createZone(formZone, token);
        toast.success(notifications("zoneCreatedSuccessfully"));
      } else if (currentView === "edit" && selectedZone) {
        await zoneService.updateZone(selectedZone.name, formZone, token);
        toast.success(notifications("zoneUpdatedSuccessfully"));
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
      toast.success(notifications("zoneDeletedSuccessfully"));
    } catch (err: any) {
      const errorMsg = err.message || notifications("failedToDeleteZone");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (currentView === "view" && selectedZone) {
    return <ZoneView zone={selectedZone} onBack={handleBackToList} />;
  }

  if (currentView === "edit" || currentView === "create") {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          {dashboard("adminDashboard")}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("drones")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "drones"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {dashboard("droneManagement")}
            </button>
            <button
              onClick={() => setActiveTab("zones")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "zones"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {dashboard("zoneManagement")}
            </button>
            <button
              onClick={() => setActiveTab("email-config")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "email-config"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {emailConfig("emailConfiguration")}
            </button>
          </nav>
        </div>

        {activeTab === "drones" && <DroneTable />}

        {activeTab === "zones" && (
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

        {activeTab === "email-config" && <EmailConfig />}
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        zoneName={deleteTarget || ""}
        loading={loading}
        onConfirm={handleDeleteZone}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminDashboard;
