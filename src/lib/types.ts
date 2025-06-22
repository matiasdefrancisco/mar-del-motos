import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

// Tipos de roles de usuario
export type UserRole = 'admin' | 'operator' | 'rider' | 'local' | null;

export interface BaseProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalProfile extends BaseProfile {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  contactPerson?: string;
  totalDebt?: number;
}

export interface RiderProfile extends BaseProfile {
  phone?: string;
  vehicleType?: string;
  totalDebt?: number;
}

export type UserProfile = BaseProfile | LocalProfile | RiderProfile;

export interface AppUser extends FirebaseUser {
  profile: UserProfile;
}

export type OrderStatus = 
  | 'peticion_enviada'        // Petición enviada / Repartidor asignado (ETA)
  | 'pendiente_aceptacion_op' // Pendiente de aceptación del operador
  | 'pendiente_asignacion'    // Pendiente de asignación de repartidor
  | 'asignado_rider'          // Asignado a repartidor
  | 'en_camino_retiro'        // Repartidor en camino al local
  | 'repartidor_en_camino'    // Repartidor en camino (alternativo)
  | 'retirado_local'          // Pedido retirado del local
  | 'pedido_retirado'         // Pedido retirado (alternativo)
  | 'en_camino_entrega'       // Repartidor en camino a entregar
  | 'saldo_definido'          // Saldo abonado o a saldar (obligatorio)
  | 'entregado_repartidor'    // Entregado al repartidor
  | 'entregado_cliente'       // Entregado al cliente (solo visible al operador)
  | 'cancelado';              // Pedido cancelado

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: Timestamp | Date;
  userId?: string;
  userName?: string;
  notes?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderObservation {
  id: string;
  type: 'mala_presentacion' | 'mochila_mal_estado' | 'sin_casco' | 'mala_educacion' | 'otros';
  description?: string;
  createdAt: Date | Timestamp;
  createdBy: string;
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
  deliveredToRiderAt?: Timestamp | Date | null;
  deliveredToCustomerAt?: Timestamp | Date | null;
  statusHistory?: OrderStatusHistoryEntry[];
  internalNotes?: string;
  
  // Registro informativo de pagos
  amountPaid?: number;      // Registro del monto informado como pagado por el cliente
  amountOwed?: number;      // Registro del monto informado como pendiente del repartidor
  paymentStatus?: 'completo' | 'deuda_rider' | 'pendiente';  // Estado informativo del registro de pago
  
  // Observaciones del local sobre el repartidor
  observations?: OrderObservation[];
  
  // Campo calculado para UI
  duration?: string; 
  eta?: string;
}

export interface Debt {
  id: string;
  orderId?: string;
  riderId: string;
  riderName: string;
  localId?: string;
  localName?: string;
  amount: number;
  dueDate: Timestamp | Date;
  status: 'pendiente' | 'pagada' | 'vencida';
  description: string;
  createdAt: Timestamp | Date;
  resolvedAt?: Timestamp | Date | null;
  resolvedBy?: string;
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'online' | 'offline' | 'ocupado';
  vehicleType?: 'moto' | 'bici';
  totalDebt?: number;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date | Timestamp;
  };
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface Local {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email: string;
  contactPerson?: string;
  totalDebt?: number;
  isActive?: boolean;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface Assignment {
  id: string;
  orderId: string;
  riderId: string;
  riderName: string;
  assignedAt: Date | Timestamp;
  assignedBy: string;
  estimatedTime?: number; // en minutos
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  targetId?: string;
  targetType?: 'order' | 'user' | 'debt' | 'assignment';
  details: string;
  timestamp: Date | Timestamp;
  ipAddress?: string;
}

export interface AppConfig {
  id: string;
  debtBlockingEnabled: boolean;
  maxDebtAmount: number;
  defaultETA: number;
  notificationsEnabled: boolean;
  updatedAt: Date | Timestamp;
  updatedBy: string;
}
