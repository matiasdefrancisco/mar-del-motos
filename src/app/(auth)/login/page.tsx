import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Ingresa a tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Link href="#" className="text-sm text-primary hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
