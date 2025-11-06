import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface NavItemsGroup {
  title: string;
  children: NavItem[];
  permission?: string;
}

interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  children?: NavItem[];
  isActive?: boolean;
  permission?: string;
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
  permissions: Permission[];
  isAdmin: boolean;
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

interface Permission {
  id: number;
  name: string;
  display_name: string;
  group: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  permissions: Permission[];
}
