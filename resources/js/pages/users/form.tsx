import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface UserFormProps {
  user?: User;
  roles: Role[];
  currentRoles?: string[];
}

export default function UserForm({ user, roles, currentRoles }: UserFormProps) {
  const isEdit = !!user;

  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles || []);

  const rolesOptions = roles.map((role) => {
    return { label: role.display_name, value: role.name };
  });

  const title = isEdit ? 'Редактирование пользователя' : 'Добавление пользователя';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Пользователи',
      href: route('users.index'),
    },
    {
      title: title,
      href: '#',
    },
  ];

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roles: currentRoles || [],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      put(route('users.update', user?.id));
    } else {
      post(route('users.store'));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <div className="flex-1 p-4">
        <Card className="max-w-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {isEdit
                ? 'Обновить пользовательские данные и роли'
                : 'Создать нового пользователя и задать роли'}
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    placeholder="Полное имя"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={errors.name && 'border-red-600'}
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email адрес"
                    value={data.email}
                    autoComplete="off"
                    onChange={(e) => setData('email', e.target.value)}
                    className={errors.email && 'border-red-600'}
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Пароль {isEdit && '(не обязательно)'}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="off"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={errors.password && 'border-red-600'}
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="roles">Роли</Label>
                  <MultiSelect
                    id="roles"
                    variant="secondary"
                    options={rolesOptions}
                    onValueChange={(value) => {
                      setData('roles', value);
                      setSelectedRoles(value);
                    }}
                    defaultValue={selectedRoles}
                    placeholder="Выберите роли"
                    selectAllText="Выбрать все"
                    searchOptionsText="Поиск..."
                    clearButtonText="Очистить"
                    closeButtonText="Закрыть"
                    animationConfig={{
                      badgeAnimation: 'none',
                      popoverAnimation: 'none',
                      optionHoverAnimation: 'none',
                    }}
                    emptyIndicator={<span>Нет результатов.</span>}
                  />
                  <InputError message={errors.roles} />
                </div>

                <Separator />

                <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
                  <Link href={route('users.index')} className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full">
                      Назад
                    </Button>
                  </Link>
                  <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                    {processing ? (
                      <span className="flex items-center gap-1">
                        <Spinner /> Сохранение...
                      </span>
                    ) : isEdit ? (
                      'Сохранить изменения'
                    ) : (
                      'Создать пользователя'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
