import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {children}
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Mar del Motos. Matias de francisco - Desarrollador. Derechos reservados.
        </p>
      </footer>
    </div>
  );
}
