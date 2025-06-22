import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import AppLogo from '@/components/layout/AppLogo';

export const metadata: Metadata = {
  title: 'Registrarse - Mar del Motos',
  description: 'Crea una nueva cuenta en Mar del Motos.',
};

export default function RegisterPage() {
  return (
    <Card className="shadow-xl bg-[#1a1a1a] relative pt-14 border-0 border-t-4 border-[#ffd700] w-full max-w-lg shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-[#1a1a1a] rounded-full shadow-lg ring-2 ring-[#ffd700] flex items-center justify-center">
        <AppLogo iconSize={70} showText={false} />
      </div>

      <CardHeader className="text-center pt-4 pb-4">
        <CardTitle className="text-2xl font-semibold text-white">
          Crear Cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pt-4 pb-6">
        <RegisterForm />
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm">
            <span className="text-white/70">¿Ya tienes una cuenta? </span>
            <span className="text-[#ffd700] hover:underline">Inicia Sesión</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
