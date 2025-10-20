import { type CSSProperties, type ReactNode, useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'

type ShellVariant = 'header' | 'sidebar';

interface AppShellProps {
  children: ReactNode;
  variant?: ShellVariant;
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
  const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar_state') !== 'false' : true));

  const handleSidebarChange = (open: boolean) => {
    setIsOpen(open);

    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_state', String(open));
    }
  };

  if (variant === 'header') {
    return (
      <div className="flex min-h-screen w-full flex-col">{children}</div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={isOpen}
      open={isOpen}
      onOpenChange={handleSidebarChange}
    >
      {children}
    </SidebarProvider>
  )
}
