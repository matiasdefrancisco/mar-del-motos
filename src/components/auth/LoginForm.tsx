// src/components/auth/LoginForm.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);
    try {
      await login(email, password);
      // En un escenario real con "Recordarme", aquí se manejaría la persistencia de la sesión.
      router.push('/dashboard');
    } catch (error: any) {
      setFormError(error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de inicio de sesión</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="sr-only">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
            className="bg-input pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="sr-only">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="bg-input pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="mr-2"
        />
        <Label htmlFor="remember-me" className="text-sm text-muted-foreground">Recordarme</Label>
      </div>
      <div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <span className="animate-spin mr-2"> M </span>
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Iniciar Sesión
        </Button>
      </div>
      <div className="mt-4 text-xs text-center text-muted-foreground/80 pt-4 border-t border-border">
        <p className="font-semibold">Usuarios de prueba:</p>
        <ul className="list-none">
          <li>admin@example.com</li>
          <li>operator@example.com</li>
          <li>rider@example.com</li>
          <li>local@example.com</li>
        </ul>
        <p>Contraseña para todos: <code className="font-semibold">password</code></p>
      </div>
    </form>
  );
}
