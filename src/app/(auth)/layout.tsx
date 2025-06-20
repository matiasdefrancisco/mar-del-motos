import type { ReactNode } from 'react';
import AppLogo from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="mb-4 flex w-full justify-center"> {/* Reduced margin-bottom */}
        {/* Reduced iconSize and hiding text */}
        <AppLogo className="text-primary" iconSize={100} showText={false} />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-2 text-center text-sm text-muted-foreground"> {/* Reduced margin-top */}
        <p>&copy; {new Date().getFullYear()} Mar del Motos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
