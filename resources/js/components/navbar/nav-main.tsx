import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import usePermissions from '@/hooks/use-permissions';
import { NavItemsGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
  itemGroups: NavItemsGroup[];
}

export function NavMain({ itemGroups = [] }: NavMainProps) {
  const page = usePage();
  const { can } = usePermissions();

  return (
    <>
      {itemGroups.length > 0 &&
        itemGroups
          .filter((group) => group.permission && can(group.permission))
          .map((group, index) => (
            <SidebarGroup className="py-0" key={index}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.children.length > 0 &&
                  group.children
                    .filter((el) => el.permission && can(el.permission))
                    .map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={page.url.startsWith(
                            (typeof item.href === 'string' ? item.href : item.href.url) as string,
                          )}
                          tooltip={{ children: item.title }}
                        >
                          <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
    </>
  );
}
