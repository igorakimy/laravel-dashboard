import { AppContent } from '@/components/app/app-content';
import { AppShell } from '@/components/app/app-shell';
import { type ReactNode } from 'react';

interface AppHeaderLayoutProps {
  children: ReactNode;
}
export default function AppHeaderLayout({ children }: AppHeaderLayoutProps) {
  return (
    <AppShell>
      <AppContent>{children}</AppContent>
    </AppShell>
  );
}
