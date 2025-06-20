import type { ReactNode } from 'react';
import AppLogo from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="mb-8 flex justify-center"> {/* Cambiado para usar flex para centrar */}
        {/* Aumentamos iconSize a 120 y mantenemos textSize */}
        <AppLogo className="text-primary" iconSize={120} textSize="text-3xl" />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mar del Motos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
