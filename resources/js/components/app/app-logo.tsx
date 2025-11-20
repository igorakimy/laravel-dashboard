import { AppLogoIcon } from '@/components/app/app-logo-icon';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
  const { settings } = usePage<SharedData>().props;

  return (
    <>
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        <AppLogoIcon className="size-5 fill-current text-white dark:text-white" />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-tight font-semibold">
          {settings.general.app_name}
        </span>
      </div>
    </>
  );
}
