import type { ReactNode } from 'react';
// AppLogo no se importa aquí, se moverá a la página de login si es necesario de forma específica.

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* El AppLogo global se elimina de aquí. La página de login lo manejará. */}
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-2 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mar del Motos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
