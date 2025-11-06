import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
      {children}
      <Toaster richColors closeButton position="top-center" />
    </AppLayoutTemplate>
  );
}
