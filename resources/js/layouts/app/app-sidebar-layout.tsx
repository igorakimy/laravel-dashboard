import { AppSidebar } from '@/components/app/app-sidebar';
import { type ReactNode } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { AppContent } from '@/components/app/app-content'
import { AppSidebarHeader } from '@/components/app/app-sidebar-header'

interface AppSidebarLayoutProps {
  children: ReactNode;
}

export default function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar">
        <AppSidebarHeader />
        {children}
      </AppContent>
    </AppShell>
  );
}
