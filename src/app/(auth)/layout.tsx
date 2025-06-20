import type { ReactNode } from 'react';
import AppLogo from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="mb-8 text-center">
        <div className="inline-block">
          {/* Aumentamos iconSize de 48 a 96 para duplicar el tamaño del logo. Mantenemos textSize */}
          <AppLogo className="text-primary" iconSize={96} textSize="text-3xl" />
        </div>
        {/* Se eliminó el subtítulo "Gestión de Mensajería y Cobranzas" */}
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
