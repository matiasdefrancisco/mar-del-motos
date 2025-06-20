
import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'operator' | 'rider' | 'local' | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

export type AppUser = FirebaseUser & { profile?: UserProfile };

export type OrderStatus = 
  | 'pendiente_aceptacion_op' 
  | 'pendiente_asignacion' 
  | 'asignado_rider' 
  | 'en_camino_retiro' 
  | 'retirado_local' 
  | 'en_camino_entrega' 
  | 'entregado_cliente' 
  | 'cancelado';

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: Timestamp | Date; // Use Timestamp for Firestore, Date for client-side Date objects
  userId?: string; // UID of user who changed status (operator/rider)
  userName?: string;
}
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  localId: string;
  localName: string;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  items?: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  assignedRiderId?: string | null;
  assignedRiderName?: string | null;
  createdAt: Timestamp | Date;
  operatorAcceptedAt?: Timestamp | Date | null;
  assignedToRiderAt?: Timestamp | Date | null;
  pickedUpByRiderAt?: Timestamp | Date | null;
  deliveredToCustomerAt?: Timestamp | Date | null;
  statusHistory?: OrderStatusHistoryEntry[];
  internalNotes?: string;
  paymentStatus?: 'pendiente_local' | 'pagado_local' | 'deuda_rider';
  requiresCollection?: boolean;
  collectionAmount?: number;
  // Client-side specific fields for display
  duration?: string; 
}

export interface Debt {
  id: string;
  orderId?: string; // Link to specific order if applicable
  riderId: string;
  riderName: string; // Denormalized for easy display
  localId?: string; // If debt is related to a specific local
  localName?: string; // Denormalized
  amount: number;
  dueDate: Timestamp | Date;
  status: 'pendiente' | 'pagada' | 'vencida';
  description: string;
  createdAt: Timestamp | Date;
  resolvedAt?: Timestamp | Date | null;
}

export interface Rider {
  id: string; // Corresponds to auth UID
  name: string;
  email: string;
  phone?: string;
  status: 'online' | 'offline' | 'ocupado'; // ocupado = busy
  // currentLocation?: GeoPoint; // For map integration later
  vehicleType?: 'moto' | 'bici';
  totalDebt?: number; // Aggregated from Debts collection, for quick view
}

export interface Local {
  id: string; // Corresponds to auth UID or custom ID
  name: string;
  address: string;
  phone?: string;
  email: string;
  contactPerson?: string;
}
