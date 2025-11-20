import { NavMain } from '@/components/navbar/nav-main';
import { NavUser } from '@/components/navbar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavItemsGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Settings, ShieldUser, UsersRound } from 'lucide-react';
import { ComponentProps } from 'react';
import AppLogo from './app-logo';

const navItemsGroups: NavItemsGroup[] = [
  {
    title: 'Платформа',
    permission: 'dashboard-view',
    children: [
      {
        title: 'Панель управления',
        href: '/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard-view',
      },
    ],
  },
  {
    title: 'Доступ',
    permission: 'access-view',
    children: [
      {
        title: 'Роли',
        href: '/roles',
        icon: ShieldUser,
        permission: 'roles-view',
      },
      {
        title: 'Пользователи',
        href: '/users',
        icon: UsersRound,
        permission: 'users-view',
      },
    ],
  },
  {
    title: 'Конфигурация',
    permission: 'settings-view',
    children: [
      {
        title: 'Настройки',
        href: '/settings/general/edit',
        icon: Settings,
        permission: 'settings-view',
      },
    ],
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={route('home')} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain itemGroups={navItemsGroups} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
