
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo'; 

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Ingresa a tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <Card className="shadow-xl bg-secondary relative pt-16 border-0 border-t-4 border-accent w-full max-w-lg">
      
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-secondary rounded-full shadow-lg ring-2 ring-accent flex items-center justify-center">
        <AppLogo iconSize={70} showText={false} />
      </div>

      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">Ingresa a Mar del Motos</CardTitle>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6 pb-8">
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
