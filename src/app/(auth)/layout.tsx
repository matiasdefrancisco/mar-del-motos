import type { ReactNode } from 'react';
import AppLogo from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="w-full max-w-md bg-background p-8 rounded-lg shadow-xl">
        <div className="mb-8 text-center">
           <div className="inline-block">
            <AppLogo className="text-primary" iconSize={40} textSize="text-3xl" />
           </div>
        </div>
        {children}
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mar del Motos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
