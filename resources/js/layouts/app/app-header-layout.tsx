import { type ReactNode } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { AppContent } from '@/components/app/app-content'

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
