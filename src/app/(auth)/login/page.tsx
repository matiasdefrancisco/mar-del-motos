
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
    <Card className="shadow-xl bg-secondary relative pt-12 border-0 border-t-4 border-accent w-full max-w-md">
      
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-2 bg-secondary rounded-full shadow-lg ring-2 ring-accent flex items-center justify-center">
        <AppLogo iconSize={50} showText={false} />
      </div>

      <CardHeader className="text-center pt-0 pb-3"> {/* Reduced padding */}
        <CardTitle className="text-xl font-bold text-foreground">Iniciar Sesión</CardTitle>
        {/* CardDescription removed as per request */}
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-4"> {/* Adjusted padding */}
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-1 pt-3 pb-4"> {/* Reduced padding and space */}
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
