import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppLayoutTemplate>
      {children}
    </AppLayoutTemplate>
  );
}
