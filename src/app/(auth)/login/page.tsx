import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo'; // Importar AppLogo

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Ingresa a tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <Card className="shadow-xl bg-secondary relative pt-16"> {/* Añadido relative y pt-16 */}
      
      {/* Logo superpuesto */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="p-3 bg-secondary rounded-full shadow-lg ring-2 ring-primary flex items-center justify-center">
          <AppLogo iconSize={60} showText={false} />
        </div>
      </div>

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
