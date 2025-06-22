import { Bike } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export function AppLogo({ className, iconSize = 32, textSize = "text-lg", showText = true }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Bike size={iconSize} className="text-[#ffd700]" />
      {showText && (
        <span className={cn("font-semibold tracking-tight text-white", textSize)}>
          Mar del Motos
        </span>
      )}
    </div>
  );
}

export default AppLogo;
