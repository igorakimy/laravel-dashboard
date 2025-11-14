import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';

interface AppearanceToggleTabsProps {
  className?: string;
}

interface AppearanceTab {
  value: Appearance;
  icon: LucideIcon;
  label: string;
}

export default function AppearanceToggleTabs({
  className = '',
  ...props
}: AppearanceToggleTabsProps) {
  const { appearance, updateAppearance } = useAppearance();

  const tabs: AppearanceTab[] = [
    { value: 'light', icon: Sun, label: 'Светлая' },
    { value: 'dark', icon: Moon, label: 'Темная' },
    { value: 'system', icon: Monitor, label: 'Системная' },
  ];

  return (
    <div
      className={cn(
        'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
        className,
      )}
      {...props}
    >
      {tabs.map(({ value, icon: Icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <button
              onClick={() => updateAppearance(value)}
              className={cn(
                'flex items-center rounded-md px-2.5 py-1.5',
                appearance === value
                  ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                  : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
              )}
            >
              <Icon className="-ml-0.5 h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-normal">{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
