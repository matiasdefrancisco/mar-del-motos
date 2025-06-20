import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrarse - Mar del Motos',
  description: 'Crea una nueva cuenta en Mar del Motos.',
};

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">Crear Cuenta</h2>
      <RegisterForm />
    </div>
  );
}
