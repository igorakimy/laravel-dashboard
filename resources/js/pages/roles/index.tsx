import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Permission, Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pen, Plus, ShieldCheck, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Роли',
    href: route('roles.index'),
  },
];

interface RoleIndexProps {
  roles: Role[];
  permissions: Permission[];
}

export default function RoleIndex({ roles }: RoleIndexProps) {
  const { can } = usePermissions();
  const { delete: destroy } = useForm();

  const undeletableRoles = ['admin', 'user'];

  const handleDeleting = (role: Role) => {
    destroy(route('roles.destroy', role.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Управление ролями" />

      <div className="flex-1 space-y-6 p-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Роли</h1>
            <p className="text-muted-foreground">
              Управление ролями пользователя и правами доступа в системе
            </p>
          </div>

          {can('roles-create') && (
            <Link href={route('roles.create')}>
              <Button className="w-full md:w-auto" size="sm">
                <Plus />
                Добавить роль
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {roles.length === 0 && (
            <Card>
              <CardContent className="text-muted-foreground py-6 text-center">
                Роли отсутствуют
              </CardContent>
            </Card>
          )}

          {roles.map((role) => (
            <Card key={role.id} className="border">
              <CardHeader className="bg-muted/40 flex space-y-2 rounded-lg md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <ShieldCheck className="text-primary h-4 w-4" />
                    {role.display_name}
                  </CardTitle>
                  <div className="text-muted-foreground text-sm">
                    {role.name === 'admin'
                      ? 'Всё разрешено'
                      : `Всего разрешений: ${role.permissions.length}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  {can('roles-edit') && (
                    <Link href={route('roles.edit', role.id)}>
                      <Button variant="outline" size="sm">
                        <Pen className="h-4 w-4" />
                        Изменить
                      </Button>
                    </Link>
                  )}

                  {!undeletableRoles.includes(role.name) && can('roles-delete') && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash />
                          Удалить
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие невозможно отменить. Это приведет к безвозвратному удалению
                            роли{' '}
                            <span className="font-semibold text-white">{role.display_name}</span>.
                            Все пользователи с этой ролью автоматически получат роль{' '}
                            <span className="font-semibold text-white">Пользователь</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={() => handleDeleting(role)}
                              variant="destructive"
                              className="text-white"
                            >
                              Продолжить
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>

              {role.permissions.length > 0 && (
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-2 text-sm font-medium">Разрешения:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="bg-green-500 text-xs font-semibold dark:bg-green-700"
                      >
                        {permission.display_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
