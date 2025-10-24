import Heading from '@/components/common/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ShieldCheck, UserRound } from 'lucide-react';
import { PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Основные данные',
    href: route('user.profile', [], false),
    icon: UserRound,
  },
  {
    title: '2FA',
    href: route('user.two-factor', [], false),
    icon: ShieldCheck,
  },
];

export default function UserProfileLayout({ children }: PropsWithChildren) {
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading
        title="Профиль пользователя"
        description="Управление профилем и настройками пользователя"
      />
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${(typeof item.href === 'string' ? item.href : item.href.url) as string}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted':
                    currentPath ===
                    ((typeof item.href === 'string' ? item.href : item.href.url) as string),
                })}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
