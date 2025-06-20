
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
      router.push('/dashboard');
    } catch (error: any) {
      setFormError(error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3"> {/* Reduced space-y */}
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de inicio de sesión</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1"> {/* Reduced space-y */}
        <Label htmlFor="email" className="sr-only">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> {/* Smaller icon */}
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
            className="bg-input pl-9 h-9 text-sm" /* Smaller height and text, adjusted pl */
          />
        </div>
      </div>
      <div className="space-y-1"> {/* Reduced space-y */}
        <Label htmlFor="password" className="sr-only">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> {/* Smaller icon */}
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="bg-input pl-9 pr-9 h-9 text-sm" /* Smaller height and text, adjusted pl/pr */
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {/* Smaller icon */}
          </button>
        </div>
      </div>
      <div className="flex items-center pt-1"> {/* Added pt-1 for slight spacing */}
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="mr-2"
        />
        <Label htmlFor="remember-me" className="text-xs text-muted-foreground">Recordarme</Label> {/* Smaller text */}
      </div>
      <div className="pt-2"> {/* Added pt-2 for spacing before button */}
        <Button type="submit" size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}> {/* size="sm" */}
          {isLoading ? (
            <span className="animate-spin mr-2"> M </span>
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Iniciar Sesión
        </Button>
      </div>
    </form>
  );
}
