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
  auth: Auth;
  flash: FlashMessage;
  isSidebarOpen: boolean;
  [key: string]: unknown;
}

interface Auth {
  user: User;
}

interface FlashMessage {
  success: string | null;
  error: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
