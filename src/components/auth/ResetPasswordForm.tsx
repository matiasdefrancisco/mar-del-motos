'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Mail } from 'lucide-react';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Aquí irá la lógica de Firebase para resetear la contraseña
      // await auth.sendPasswordResetEmail(email);
      setIsSuccess(true);
    } catch (error: any) {
      setFormError(error.message || 'Error al enviar el correo de recuperación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
        <AlertTitle>Correo enviado</AlertTitle>
        <AlertDescription>
          Hemos enviado un correo con las instrucciones para recuperar tu contraseña.
          Por favor, revisa tu bandeja de entrada y sigue los pasos indicados.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            required
            className="bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20"
          />
        </div>
        <p className="text-xs text-white/70">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>
      </div>

      <div className="pt-3">
        <Button 
          type="submit" 
          size="sm" 
          className="w-full bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Enviar Instrucciones
        </Button>
      </div>
    </form>
  );
} 