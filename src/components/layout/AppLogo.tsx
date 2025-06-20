import Link from 'next/link';
import { Bike } from 'lucide-react'; // Example icon

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

const AppLogo = ({ className, iconSize = 24, textSize = "text-xl", showText = true }: AppLogoProps) => {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <Bike size={iconSize} className="text-sidebar-primary" />
      {showText && <h1 className={`font-bold ${textSize} text-sidebar-foreground`}>Mar del Motos</h1>}
    </Link>
  );
};

export default AppLogo;
