import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppSidebarHeader() {
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  );
}
