import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Ingresa a tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">Iniciar Sesión</h2>
      <LoginForm />
    </div>
  );
}
