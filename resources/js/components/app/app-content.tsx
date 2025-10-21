import { SidebarInset } from '@/components/ui/sidebar';
import { ComponentProps, ReactNode } from 'react';

interface AppContentProps extends ComponentProps<'main'> {
  variant?: 'header' | 'sidebar';
  children: ReactNode;
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
  if (variant === 'sidebar') {
    return <SidebarInset {...props}>{children}</SidebarInset>;
  }

  return (
    <main
      className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl"
      {...props}
    >
      {children}
    </main>
  );
}
