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

interface ZiggyRoutes {
  location: string;
  query: string | Array | null;
}

interface SharedData {
  auth: Auth;
  flash: FlashMessage;
  isSidebarOpen: boolean;
  ziggy: ZiggyRoutes;
  settings: {
    general: GeneralSettings;
  };
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

interface QueryParams {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string | null;
  sort_dir?: 'asc' | 'desc' | null;
  [key: string]: unknown;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: PaginationLink[];
  [key: string]: unknown;
}

interface PaginatedData<T> {
  data: T[];
  query_params: QueryParams;
  meta: PaginationMeta;
  links: SimplePaginationLinks;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface SimplePaginationLinks {
  first: string | null;
  last: string | null;
  next: string | null;
  prev: string | null;
}

interface BulkAction<TData> {
  label: string;
  icon?: LucideIcon | null;
  onClick: (selectedRows: TData[]) => void | false;
  className?: string;
  forAll?: boolean;
  separatorBefore?: boolean;
  clearSelected?: boolean;
  permissions: string;
  alertDialog?: {
    title: string;
    description: string;
    actionText: string;
    onClick: (selectedRows: TData[]) => void;
    open: boolean;
    onClose: () => void;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  has_ban: boolean;
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

interface GeneralSettings {
  app_name: string;
  app_description: string;
}
