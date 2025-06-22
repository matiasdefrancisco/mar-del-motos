import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import '../styles/layout-reset.css'; // Eliminada la importación de layout-reset.css
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mar del Motos',
  description: 'Sistema de gestión para Mar del Motos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-full bg-background text-foreground antialiased`}>
        <AuthProvider>
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
