import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Ingresa a tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">Iniciar Sesión</h2>
      <LoginForm />
      <div className="mt-6 text-sm text-center">
        <p className="text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
