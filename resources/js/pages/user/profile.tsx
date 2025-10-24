import HeadingSmall from '@/components/common/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserChangeProfileModal from '@/components/user/user-change-profile-modal';
import AppLayout from '@/layouts/app-layout';
import UserProfileLayout from '@/layouts/user/user-profile-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Профиль пользователя',
    href: route('user.profile'),
  },
];

export default function Profile() {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Профиль" />

      <UserProfileLayout>
        <div className="space-y-6">
          <HeadingSmall title="Информация о пользователе" />

          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" type="text" name="name" value={auth.user.name} readOnly />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={auth.user.email} readOnly />
            </div>

            <UserChangeProfileModal>
              <Button>Изменить</Button>
            </UserChangeProfileModal>
          </div>
        </div>
      </UserProfileLayout>
    </AppLayout>
  );
}
