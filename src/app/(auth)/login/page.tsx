import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Mar del Motos',
  description: 'Inicia sesión en tu cuenta de Mar del Motos.',
};

export default function LoginPage() {
  return (
    <Card className="w-full bg-[#2d2d2d] border-[#333333] border-t-4 border-t-[#ffd700] shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative pt-16">
      {/* Círculo del logo */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[#1a1a1a] border-2 border-[#ffd700] flex items-center justify-center shadow-lg">
        <Image 
          src="/image.png" 
          alt="Logo Mar del Motos" 
          width={80} 
          height={80} 
          priority 
          className="rounded-full"
        />
      </div>

      <CardContent className="pt-4 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ingresa a Mar del Motos
          </h1>
          <p className="text-gray-400">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
        
        <LoginForm />
      </CardContent>
    </Card>
  );
}
