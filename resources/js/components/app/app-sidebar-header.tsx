import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem } from '@/types';
import AppearanceToggleTabs from '@/components/appearance/appearance-tabs';

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="flex w-full justify-end px-4">
        <AppearanceToggleTabs />
      </div>
    </header>
  );
}
