'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, UserPlus, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserRole } from '@/lib/types';

const registerSchema = z.object({
  displayName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'operator', 'rider', 'local'], { message: "Debes seleccionar un rol." })
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register: authRegister } = useAuth(); // Renombrar para evitar conflicto con register de RHF
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'rider', // Default role
    }
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await authRegister(data.email, data.password, data.displayName, data.role as UserRole);
      // En una app real, Firebase createUserWithEmailAndPassword y luego actualizar perfil.
      // Aquí, la función register del AuthContext es un mock.
      router.push('/login?registration=success'); // Redirigir a login con mensaje de éxito
    } catch (error: any) {
      setFormError(error.message || 'Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Registro</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="displayName">Nombre Completo</Label>
        <Input
          id="displayName"
          type="text"
          {...register("displayName")}
          placeholder="Juan Pérez"
          className="bg-input mt-1"
        />
        {errors.displayName && <p className="text-sm text-destructive mt-1">{errors.displayName.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="usuario@example.com"
          className="bg-input mt-1"
        />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="bg-input mt-1"
        />
        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          className="bg-input mt-1"
        />
        {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="role">Rol</Label>
        <Select defaultValue="rider" onValueChange={(value) => register("role").onChange({ target: { value, name: "role" }})}>
          <SelectTrigger id="role" className="bg-input mt-1">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rider">Rider</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="operator">Operador</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
      </div>

      <div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Registrarse
        </Button>
      </div>
      <div className="text-sm text-center">
        <Link href="/login" className="font-medium text-primary hover:underline">
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </div>
    </form>
  );
}
