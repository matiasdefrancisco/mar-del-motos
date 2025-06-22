import type { UserRole } from './types';

/**
 * Obtiene la ruta del dashboard correspondiente según el rol del usuario
 */
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'operator':
      return '/dashboard/operator';
    case 'rider':
      return '/dashboard/rider';
    case 'local':
      return '/dashboard/local';
    default:
      return '/login';
  }
};

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export const hasRoleAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Obtiene los roles permitidos para una ruta específica
 */
export const getAllowedRolesForPath = (pathname: string): UserRole[] | undefined => {
  if (pathname.startsWith('/dashboard/admin')) {
    return ['admin'];
  } else if (pathname.startsWith('/dashboard/operator')) {
    return ['operator'];
  } else if (pathname.startsWith('/dashboard/rider')) {
    return ['rider'];
  } else if (pathname.startsWith('/dashboard/local')) {
    return ['local'];
  }
  return undefined;
};

/**
 * Determina si una ruta requiere autenticación
 */
export const requiresAuth = (pathname: string): boolean => {
  const publicRoutes = ['/login', '/register', '/reset-password', '/'];
  return !publicRoutes.includes(pathname) && !pathname.startsWith('/api/');
};

/**
 * Obtiene la URL de redirección después del login
 */
export const getRedirectUrl = (userRole: UserRole, intendedPath?: string): string => {
  if (intendedPath && intendedPath !== '/' && intendedPath !== '/login') {
    const allowedRoles = getAllowedRolesForPath(intendedPath);
    if (allowedRoles && hasRoleAccess(userRole, allowedRoles)) {
      return intendedPath;
    }
  }
  return getDashboardPath(userRole);
};

/**
 * Valida si el usuario actual puede acceder a la ruta
 */
export const validateRouteAccess = (
  userRole: UserRole, 
  pathname: string
): { hasAccess: boolean; redirectTo?: string } => {
  if (!requiresAuth(pathname)) {
    return { hasAccess: true };
  }

  if (!userRole) {
    return { hasAccess: false, redirectTo: '/login' };
  }

  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!allowedRoles) {
    // Ruta del dashboard general, redirigir al dashboard específico del rol
    if (pathname === '/dashboard') {
      return { hasAccess: false, redirectTo: getDashboardPath(userRole) };
    }
    return { hasAccess: true };
  }

  if (!hasRoleAccess(userRole, allowedRoles)) {
    return { hasAccess: false, redirectTo: getDashboardPath(userRole) };
  }

  return { hasAccess: true };
}; 