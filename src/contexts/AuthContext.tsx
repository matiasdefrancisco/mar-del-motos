'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase/config';
import type { UserRole, AppUser, UserProfile } from '@/lib/types';
import { toastSuccess, toastError, toastInfo } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
  userRole: UserRole;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    console.log('AuthProvider: Iniciando escucha de cambios de autenticación');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthProvider: Estado de autenticación cambió:', user?.email);
      
      try {
        if (user) {
          console.log('AuthProvider: Obteniendo datos del usuario de Firestore');
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            console.log('AuthProvider: Datos del usuario obtenidos:', { 
              email: userData.email, 
              role: userData.role,
              status: userData.status 
            });
            
            // Verificar que el usuario esté activo
            if (userData.status !== 'active') {
              console.log('AuthProvider: Usuario inactivo, cerrando sesión');
              await firebaseSignOut(auth);
              setError('Tu cuenta ha sido desactivada. Contacta al administrador.');
              setCurrentUser(null);
              setUserRole(null);
              setLoading(false);
              return;
            }
            
            setUserRole(userData.role);
            setCurrentUser({
              ...user,
              profile: userData
            });
          } else {
            console.log('AuthProvider: No se encontró documento del usuario, cerrando sesión');
            await firebaseSignOut(auth);
            setError('No se encontraron datos del usuario en el sistema.');
            setCurrentUser(null);
            setUserRole(null);
          }
        } else {
          console.log('AuthProvider: No hay usuario autenticado');
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('AuthProvider: Error al obtener datos del usuario:', err);
        setError('Error al cargar datos del usuario');
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Limpiando listener de autenticación');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Iniciando proceso de login para:', email);
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Login exitoso, obteniendo datos del usuario');
      
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userData: UserProfile;
      
      if (!userDoc.exists()) {
        console.log('AuthProvider: Usuario no existe en Firestore, creando documento...');
        
        // Crear documento básico del usuario
        // NOTA: Deberás configurar el rol manualmente en Firebase Console
        userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Usuario',
          photoURL: userCredential.user.photoURL,
          role: null, // Se debe configurar manualmente en Firebase Console
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userDocRef, userData);
        console.log('AuthProvider: Documento del usuario creado en Firestore');
        
        // Mostrar mensaje informativo sobre configurar el rol
        toastInfo(
          'Usuario creado en base de datos', 
          'El documento del usuario se creó automáticamente. Un administrador debe asignar el rol correspondiente.'
        );
      } else {
        userData = userDoc.data() as UserProfile;
      }

      console.log('AuthProvider: Datos del usuario obtenidos:', { 
        email: userData.email, 
        role: userData.role,
        status: userData.status 
      });
      console.log('AuthProvider: Datos COMPLETOS del usuario:', JSON.stringify(userData, null, 2));
      console.log('AuthProvider: Tipo de status:', typeof userData.status);
      console.log('AuthProvider: Status exacto:', `"${userData.status}"`);
      
      // Verificar que el usuario esté activo (aceptamos tanto 'active' como 'online')
      const validStatuses = ['active', 'online'];
      if (!validStatuses.includes(userData.status)) {
        console.log('AuthProvider: Usuario inactivo - Status encontrado:', userData.status);
        console.log('AuthProvider: Status válidos:', validStatuses);
        await firebaseSignOut(auth);
        throw new Error(`Tu cuenta tiene status "${userData.status}". Contacta al administrador.`);
      }
      
      // Verificar que el usuario tenga un rol asignado
      if (!userData.role) {
        console.log('AuthProvider: Usuario sin rol asignado');
        await firebaseSignOut(auth);
        throw new Error('Tu cuenta no tiene un rol asignado. Contacta al administrador para que configure tu rol.');
      }
      
      setUserRole(userData.role);
      setCurrentUser({
        ...userCredential.user,
        profile: userData
      });
      
      // Mostrar notificación de éxito
      toastSuccess(
        '¡Bienvenido!', 
        `Sesión iniciada como ${userData.displayName || userData.email}`
      );
      
      console.log('AuthProvider: Login completado exitosamente');
    } catch (err: any) {
      console.error('AuthProvider: Error en login:', err);
      const errorMessage = getFirebaseErrorMessage(err.code || err.message);
      setError(errorMessage);
      
      // Mostrar notificación de error
      toastError('Error de Autenticación', errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, additionalData: any = {}) => {
    try {
      console.log('AuthProvider: Iniciando registro de usuario');
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Usuario creado en Auth');
      
      await updateProfile(userCredential.user, { displayName: name });
      console.log('AuthProvider: Perfil actualizado en Auth');

      const userData: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: name,
        photoURL: null,
        role: role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...additionalData
      };

      await setDoc(doc(firestore, 'users', userCredential.user.uid), userData);
      console.log('AuthProvider: Documento del usuario creado en Firestore');
      
      setUserRole(role);
      setCurrentUser({
        ...userCredential.user,
        profile: userData
      });
      
      // Mostrar notificación de éxito
      toastSuccess(
        '¡Cuenta creada!', 
        `Bienvenido ${name}. Tu cuenta ha sido creada exitosamente.`
      );
      
      console.log('AuthProvider: Registro completado exitosamente');
    } catch (err: any) {
      console.error('AuthProvider: Error en registro:', err);
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      
      // Mostrar notificación de error
      toastError('Error en Registro', errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Iniciando proceso de logout');
      const userName = currentUser?.profile?.displayName || currentUser?.email || 'Usuario';
      
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setError(null);
      
      // Mostrar notificación de logout
      toastInfo('Sesión Cerrada', `Hasta luego, ${userName}`);
      
      console.log('AuthProvider: Logout completado');
    } catch (err: any) {
      console.error('AuthProvider: Error en logout:', err);
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      
      // Mostrar notificación de error
      toastError('Error al Cerrar Sesión', errorMessage);
      
      throw err;
    }
  };

  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu email y contraseña.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      default:
        if (errorCode.includes('desactivada')) {
          return errorCode;
        }
        return 'Ha ocurrido un error inesperado';
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    userRole,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
