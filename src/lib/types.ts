import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'admin' | 'operator' | 'rider' | 'local' | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

export type AppUser = FirebaseUser & { profile?: UserProfile };

export interface Order {
  id: string;
  description: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
  local: string;
  rider?: string;
  amount: number;
  createdAt: Date;
}

export interface Debt {
  id: string;
  riderId: string;
  riderName: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}
