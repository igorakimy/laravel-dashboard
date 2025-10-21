import { User } from '@/types'
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { UserInfo } from '@/components/user/user-info'
import { Link, router } from '@inertiajs/react'
import { LogOut } from 'lucide-react'

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const handleLogout = () => {
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          className="block w-full"
          href={route('logout')}
          as="button"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" />
          Выйти
        </Link>
      </DropdownMenuItem>
    </>
  );
}
