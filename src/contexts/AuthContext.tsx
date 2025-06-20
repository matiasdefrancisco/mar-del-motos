'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { UserProfile, UserRole, AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: AuthError | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock function to get user role. Replace with actual Firestore call.
const fetchUserRole = async (uid: string, email?: string | null): Promise<UserRole> => {
  // This is a mock. In a real app, you'd fetch this from your database (e.g., Firestore).
  // For testing, we can assign roles based on email or a fixed logic.
  // Note: In a real scenario, after user creation, you'd store their chosen role in Firestore.
  // For this mock, we'll try to infer based on email for existing test users,
  // or default to 'rider' for newly registered ones if no specific logic is hit.
  if (email === 'admin@example.com') return 'admin';
  if (email === 'operator@example.com') return 'operator';
  if (email === 'rider@example.com') return 'rider';
  if (email === 'local@example.com') return 'local';
  
  // If it's a new user not matching the above, their role would have been passed during registration.
  // For onAuthStateChanged, if it's a newly registered user, the role might not be in their Firebase profile directly.
  // This mock needs to be smarter or rely on a "database" call.
  // For now, if a role was passed and stored during registration (e.g. in a mock DB), use that.
  // Otherwise, default.
  return 'rider'; // Default for this mock if no other rule applies
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
        // In a real app, `user.role` would come from your DB (e.g. Firestore claims or a document)
        // For this mock, we'll try to fetch it. If it's a newly registered user,
        // the displayName might not be set yet if updateProfile hasn't finished.
        const role = await fetchUserRole(user.uid, user.email); 
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
          photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${(user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U')}`,
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
  
  const register = async (email: string, pass: string, displayName: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      // This is a MOCK registration. In a real app, you would use:
      // const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // await updateProfile(userCredential.user, { displayName });
      // Then, you would save the user's role (and other profile info) to your database (e.g., Firestore).
      console.log('Mock Register:', { email, displayName, role });
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For the purpose of this UI task, we don't actually create a Firebase user here.
      // We just simulate success. The user would then log in with mock credentials.
      // Or, if we were actually creating, onAuthStateChanged would pick it up.
      // To make the flow somewhat realistic for UI testing, let's throw an error if it's not a test email format.
      if (!email.endsWith('@example.com')) {
        // Simulate user creation for a "real" looking email
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName });
        // Here you would save the role to Firestore
        console.log('Mock: User role ' + role + ' would be saved to DB for ' + userCredential.user.uid);
        // onAuthStateChanged will pick up the new user.
      } else {
         // For existing @example.com users, we just pretend success
         console.log("Simulating registration success for @example.com user (no actual creation). Please log in with test credentials.");
      }

    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
    // setLoading(false) is handled by onAuthStateChanged or error
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
  
  if (loading && typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
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
    <AuthContext.Provider value={{ currentUser, loading, error, login, register, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
