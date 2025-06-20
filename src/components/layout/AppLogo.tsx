import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '@/app/image.png'; // Importar el logo

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

const AppLogo = ({ className, iconSize = 24, textSize = "text-xl", showText = true }: AppLogoProps) => {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <Image 
        src={logoSrc} 
        alt="Mar del Motos Logo" 
        width={iconSize} 
        height={iconSize} 
        priority 
      />
      {showText && <h1 className={`font-bold ${textSize} text-sidebar-foreground`}>Mar del Motos</h1>}
    </Link>
  );
};

export default AppLogo;
