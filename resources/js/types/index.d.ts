import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface SharedData {
  isSidebarOpen: boolean;
  [key: string]: unknown;
}
