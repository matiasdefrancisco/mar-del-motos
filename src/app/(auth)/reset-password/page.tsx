import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña - Mar del Motos',
  description: 'Recupera el acceso a tu cuenta de Mar del Motos.',
};

export default function ResetPasswordPage() {
  return (
    <Card className="shadow-xl bg-[#1a1a1a] relative pt-14 border-0 border-t-4 border-[#ffd700] w-full max-w-lg shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-[#1a1a1a] rounded-full shadow-lg ring-2 ring-[#ffd700] flex items-center justify-center">
        <AppLogo iconSize={70} showText={false} />
      </div>

      <CardHeader className="text-center pt-4 pb-4">
        <CardTitle className="text-2xl font-semibold text-white">Recuperar Contraseña</CardTitle>
      </CardHeader>
      <CardContent className="px-8 pt-4 pb-6">
        <ResetPasswordForm />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6 pb-8">
        <p className="text-sm text-white/70">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="font-medium text-[#ffd700] hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 