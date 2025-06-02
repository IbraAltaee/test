export interface Point {
  lat: number | null;
  lng: number | null;
}

export interface Zone {
  name: string;
  path: Point[];
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface MapProps {
  zone: Zone;
  editable?: boolean;
  onPathChange?: (path: Point[]) => void;
}

export interface PointListProps {
  points: Point[];
  editable?: boolean;
  onAddPoint?: () => void;
  onRemovePoint?: (index: number) => void;
  onPointChange?: (index: number, field: 'lat' | 'lng', value: number) => void;
}

export interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  zoneName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CreateZoneFormProps {
  onSubmit: (zone: Zone) => void;
  onCancel: () => void;
}