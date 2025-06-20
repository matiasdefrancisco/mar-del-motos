'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile, UserRole, AppUser } from '@/lib/types';
// Eliminamos la importación de Skeleton aquí ya que no la usaremos directamente en este componente para la carga de página completa

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
          userProfileData = {
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
  
  // Eliminamos el bloque que renderizaba un esqueleto de página completa.
  // Los componentes consumidores (como ProtectedRoute o páginas individuales)
  // se encargarán de mostrar sus propios estados de carga basados en el prop `loading` del contexto.

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
