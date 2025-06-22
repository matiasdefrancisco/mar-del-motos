// src/components/auth/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const { login, error, loading, clearError, currentUser, userRole } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const email = watch('email');

  // Limpiar errores cuando el usuario empiece a escribir
  useEffect(() => {
    if (error && (email.length > 0)) {
      clearError();
    }
  }, [email, error, clearError]);

  // Redireccionar después del login exitoso
  useEffect(() => {
    if (currentUser && userRole) {
      console.log('LoginForm: Usuario autenticado, redirigiendo al dashboard:', userRole);
      const dashboardPath = getDashboardPath(userRole);
      router.replace(dashboardPath);
    }
  }, [currentUser, userRole, router]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      console.log('LoginForm: Iniciando login para:', data.email);
      await login(data.email, data.password);
      console.log('LoginForm: Login exitoso, la redirección se manejará en useEffect');
    } catch (err) {
      console.error('LoginForm: Error en login:', err);
      // El error se maneja en el contexto
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Autenticación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white font-medium">
          Correo Electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            className="pl-10 bg-[#1a1a1a] border-[#333333] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ingresa un correo electrónico válido'
              }
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pl-10 pr-10 bg-[#1a1a1a] border-[#333333] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-colors"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          className="border-[#333333] data-[state=checked]:bg-[#ffd700] data-[state=checked]:border-[#ffd700] data-[state=checked]:text-black"
          {...register('rememberMe')}
        />
        <Label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer">
          Recordar mis datos
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#ffd700] hover:bg-[#e6c200] text-black font-semibold py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Links */}
      <div className="space-y-4 text-center">
        <Link
          href="/reset-password"
          className="block text-sm text-[#ffd700] hover:text-[#e6c200] hover:underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        
        <div className="text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-[#ffd700] hover:text-[#e6c200] hover:underline font-medium transition-colors"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </form>
  );
}
