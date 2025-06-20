'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase/config'; // Importar firestore
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Importar funciones de Firestore
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        let userProfileData: UserProfile | null = null;
        try {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            userProfileData = {
              uid: firebaseUser.uid,
              email: data.email || firebaseUser.email,
              displayName: data.displayName || firebaseUser.displayName,
              photoURL: data.photoURL || firebaseUser.photoURL || `https://placehold.co/100x100.png?text=${(data.displayName?.charAt(0).toUpperCase() || firebaseUser.email?.charAt(0).toUpperCase() || 'U')}`,
              role: (data.role as UserRole) || 'rider', 
            };
          } else {
            console.warn(`Perfil para ${firebaseUser.uid} no encontrado en Firestore. Creando/usando perfil por defecto.`);
            const roleForFallback: UserRole =
              firebaseUser.email === 'admin@example.com' ? 'admin' :
              firebaseUser.email === 'operator@example.com' ? 'operator' :
              firebaseUser.email === 'rider@example.com' ? 'rider' :
              firebaseUser.email === 'local@example.com' ? 'local' :
              'rider'; 

            userProfileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
              photoURL: firebaseUser.photoURL || `https://placehold.co/100x100.png?text=${(firebaseUser.displayName?.charAt(0).toUpperCase() || firebaseUser.email?.charAt(0).toUpperCase() || 'U')}`,
              role: roleForFallback,
            };

            try {
              await setDoc(userDocRef, {
                email: userProfileData.email,
                displayName: userProfileData.displayName,
                role: userProfileData.role,
                photoURL: userProfileData.photoURL,
                createdAt: new Date(),
              }, { merge: true });
              console.log(`Perfil para ${firebaseUser.uid} (rol: ${userProfileData.role}) escrito/actualizado en Firestore.`);
            } catch (dbError) {
              console.error("Error escribiendo perfil a Firestore durante onAuthStateChanged:", dbError);
            }
          }
        } catch (err) {
          console.error("Error obteniendo/procesando perfil de usuario:", err);
          userProfileData = { // Fallback en caso de error mayor
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Usuario Anónimo',
            photoURL: firebaseUser.photoURL || `https://placehold.co/100x100.png`,
            role: 'rider',
          };
        }
        
        setCurrentUser({ ...firebaseUser, profile: userProfileData });
        setUserRole(userProfileData!.role);
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
      if (email.endsWith('@example.com')) {
        console.log("Registro simulado para usuarios @example.com. Inicia sesión con credenciales de prueba.");
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setLoading(false);
        // router.push('/login?registration=success'); // Opcional: Redirigir o mostrar mensaje
        return; 
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      await updateProfile(user, { displayName });

      const userProfileForDB: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${displayName.charAt(0).toUpperCase()}`,
        role: role,
      };
      
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        ...userProfileForDB,
        createdAt: new Date(), 
      });
      
      // onAuthStateChanged se encargará de actualizar currentUser y userRole
      // usando la información de Firestore.

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
