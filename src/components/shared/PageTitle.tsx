import type { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function PageTitle({ title, subtitle, icon: Icon, actions }: PageTitleProps) {
  return (
    <div className="mb-6 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-[#ffd700]" />}
          <h2 className="text-3xl font-bold leading-tight text-white sm:truncate sm:text-4xl font-headline">
            {title}
          </h2>
        </div>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 flex md:ml-4 md:mt-0">{actions}</div>}
    </div>
  );
}
