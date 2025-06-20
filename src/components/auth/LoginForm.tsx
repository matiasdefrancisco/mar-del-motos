'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, LogIn } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);
    try {
      // Example users for demo:
      // admin@example.com / password
      // operator@example.com / password
      // rider@example.com / password
      // local@example.com / password
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setFormError(error.message || 'Failed to login. Please check your credentials.');
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
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@example.com"
          required
          className="bg-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="bg-input"
        />
      </div>
      <div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <span className="animate-spin mr-2"> M </span>
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Ingresar
        </Button>
      </div>
       <div className="mt-4 text-sm text-center text-muted-foreground">
        <p>Usuarios de prueba:</p>
        <ul className="list-disc list-inside">
          <li>admin@example.com (admin)</li>
          <li>operator@example.com (operator)</li>
          <li>rider@example.com (rider)</li>
          <li>local@example.com (local)</li>
        </ul>
        <p>Contraseña para todos: <code className="font-code">password</code></p>
      </div>
    </form>
  );
}
