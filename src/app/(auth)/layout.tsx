import type { ReactNode } from 'react';
import AppLogo from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="mb-8 flex w-full justify-center"> {/* Asegurar que el contenedor tome el ancho y centre el logo */}
        {/* Aumentamos iconSize y ocultamos el texto */}
        <AppLogo className="text-primary" iconSize={160} showText={false} />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-4 text-center text-sm text-muted-foreground"> {/* Reducido el margen superior */}
        <p>&copy; {new Date().getFullYear()} Mar del Motos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
