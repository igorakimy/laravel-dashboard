import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Permission, Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface RoleFormProps {
  role?: Role;
  groupedPermissions: Record<string, Permission[]>;
}

export default function RoleForm({ role, groupedPermissions }: RoleFormProps) {
  const { can } = usePermissions();

  const isEdit = !!role;

  const title = isEdit ? 'Изменение роли' : 'Добавление роли';
  const undeletableRoles = ['admin', 'user'];

  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || '',
    display_name: role?.display_name || '',
    permissions: role?.permissions.map((p) => p.name) || [],
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Роли',
      href: route('roles.index'),
    },
    {
      title: title,
      href: '#',
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      put(route('roles.update', role.id));
    } else {
      post(route('roles.store'));
    }
  };

  const togglePermission = (permission: string) => {
    setData(
      'permissions',
      data.permissions.includes(permission)
        ? data.permissions.filter((p) => p !== permission)
        : [...data.permissions, permission],
    );
  };

  const togglePermissionGroup = (group: string, permissions: Permission[]) => {
    const allChecked = permissions.every((p) => data.permissions.includes(p.name));
    if (allChecked) {
      setData(
        'permissions',
        data.permissions.filter((p) => !permissions.map((perm) => perm.name).includes(p)),
      );
    } else {
      const newPermissions = [...data.permissions];
      permissions.forEach((p) => {
        if (!newPermissions.includes(p.name)) {
          newPermissions.push(p.name);
        }
      });
      setData('permissions', newPermissions);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <div className="flex-1 p-4">
        <Card className="max-w-4xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {isEdit ? 'Обновить роль и разрешения' : 'Создать новую роль и задать разрешения'}
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    placeholder="Введите название роли, например admin"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-600' : ''}
                    disabled={role && undeletableRoles.includes(role.name)}
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="display_name">Отображаемое название</Label>
                  <Input
                    id="display_name"
                    placeholder="Введите отображаемое название роли, например Администратор"
                    value={data.display_name}
                    onChange={(e) => setData('display_name', e.target.value)}
                    className={errors.display_name ? 'border-red-600' : ''}
                  />
                  <InputError message={errors.display_name} />
                </div>

                {role?.name !== 'admin' && (
                  <>
                    <Separator />
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold">Разрешения</h2>
                        <p className="text-muted-foreground text-sm">
                          Выберите разрешения, которые будут предоставлены этой роли
                        </p>
                      </div>

                      <InputError message={errors.permissions} />

                      <div className="grid grid-cols-2 gap-5 space-y-4">
                        {Object.entries(groupedPermissions).map(([group, permissions]) => {
                          const allChecked = permissions.every((p) =>
                            data.permissions.includes(p.name),
                          );

                          return (
                            <div
                              key={group}
                              className="bg-muted/20 mb-0 max-h-[115px] overflow-y-auto rounded-lg border p-4"
                            >
                              <div className="mb-3 flex items-center gap-2">
                                <Checkbox
                                  id={`group-${group}`}
                                  checked={allChecked}
                                  onCheckedChange={() => togglePermissionGroup(group, permissions)}
                                />
                                <Label
                                  htmlFor={`group-${group}`}
                                  className="text-muted-foreground cursor-pointer text-sm font-medium tracking-wider uppercase"
                                >
                                  {group}
                                </Label>
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
                                {permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center gap-2">
                                    <Checkbox
                                      id={`permission-${permission.id}`}
                                      checked={data.permissions.includes(permission.name)}
                                      onCheckedChange={() => togglePermission(permission.name)}
                                    />
                                    <Label
                                      htmlFor={`permission-${permission.id}`}
                                      className="cursor-pointer text-sm select-none"
                                    >
                                      {permission.display_name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Separator className="mb-6" />

              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Link href={route('roles.index')} className="w-full sm:w-auto">
                  <Button type="button" variant="secondary" className="w-full">
                    Отмена
                  </Button>
                </Link>
                {(isEdit && can('roles-edit')) || can('roles-create')}
                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Сохранение...
                    </span>
                  ) : isEdit ? (
                    'Сохранить'
                  ) : (
                    'Создать'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
