'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { UserProfile, UserRole, AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: AuthError | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock function to get user role. Replace with actual Firestore call.
const fetchUserRole = async (uid: string): Promise<UserRole> => {
  // This is a mock. In a real app, you'd fetch this from your database.
  // For testing, we can assign roles based on email or a fixed logic.
  if (uid === 'admin@example.com') return 'admin';
  if (uid === 'operator@example.com') return 'operator';
  if (uid === 'rider@example.com') return 'rider';
  if (uid === 'local@example.com') return 'local';
  // Default to a basic role or null if not found
  return 'rider'; 
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const role = await fetchUserRole(user.uid); // Or user.email if UID is not stable for mock
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${(user.email || 'U').charAt(0).toUpperCase()}`,
          role: role,
        };
        setCurrentUser({ ...user, profile });
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting user and role
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      router.push('/login');
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && typeof window !== 'undefined' && window.location.pathname !== '/login') {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-8">
          <div className="text-center">
             <svg className="mx-auto h-12 w-auto text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h1 className="mt-6 text-3xl font-extrabold text-foreground">Mar del Motos</h1>
            <p className="mt-2 text-muted-foreground">Cargando...</p>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }


  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
