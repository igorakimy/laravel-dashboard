import DataTable from '@/components/datatable/datatable';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BulkAction, PaginatedData, Role, SharedData, User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Ban, CircleCheck, CircleOff, MoreVertical, Pen, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Пользователи',
    href: route('users.index'),
  },
];

interface UsersIndexProps {
  users: PaginatedData<User>;
}

export default function UsersIndex({ users }: UsersIndexProps) {
  const getInitials = useInitials();
  const { can } = usePermissions();
  const { auth } = usePage<SharedData>().props;
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState<boolean>(false);

  const { delete: destroy, post } = useForm();

  const handleDelete = (id: number) => {
    destroy(route('users.destroy', id));
  };

  const handleBulkDelete = (selectedRows: User[]) => {
    router.delete(route('users.bulk-delete'), {
      data: {
        ids: selectedRows.map((r) => r.id),
      },
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleBan = (id: number) => {
    post(route('users.ban', id));
  };

  const handleUnban = (id: number) => {
    post(route('users.unban', id));
  };

  const bulkActions: BulkAction<User>[] = [
    {
      label: 'Забанить выбранные',
      icon: Ban,
      clearSelected: true,
      onClick: (selectedRows) => {
        router.delete(route('users.bulk-ban'), {
          data: {
            ids: selectedRows.map((r) => r.id),
          },
          preserveScroll: true,
          preserveState: true,
        });
      },
      permissions: 'users-ban',
    },
    {
      label: 'Удалить выбранные',
      icon: Trash,
      className: 'dark:text-red-400',
      separatorBefore: true,
      alertDialog: {
        actionText: 'Удалить',
        title: 'Вы уверены?',
        description: 'Это действие нельзя отменить. Выбранные пользователи будут удалены.',
        onClick: (selectedRows) => handleBulkDelete(selectedRows),
        open: bulkDeleteOpen,
        onClose: () => {
          setBulkDeleteOpen(false);
        },
      },
      onClick: () => {
        setBulkDeleteOpen(true);
      },
      permissions: 'users-delete',
    },
  ];

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      enableSorting: true,
      header: 'Имя',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full select-none">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {row.getValue('name')}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      enableSorting: true,
      header: 'Email',
      cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'roles',
      header: 'Роли',
      enableSorting: true,
      cell: ({ row }) => {
        const roles: Role[] = row.getValue('roles');

        const getBadgeStyleClass = (role: string): string => {
          switch (role) {
            case 'admin':
              return 'bg-blue-500 text-white dark:bg-blue-600';
            default:
              return 'bg-neutral-500 text-white dark:bg-neutral-600';
          }
        };

        return (
          <div className="flex gap-1">
            {roles.map((r) => (
              <Badge key={r.name} variant="outline" className={getBadgeStyleClass(r.name)}>
                {r.display_name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        if (row.original.has_ban) {
          return (
            <Badge variant="outline" className="border-destructive text-destructive gap-1 px-1.5">
              <Ban className="h-3 w-3" />
              Забанен
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="gap-1 border-green-600 px-1.5 text-green-600">
            <CircleCheck className="h-3 w-3" />
            Активен
          </Badge>
        );
      },
    },
  ];

  const allColumns = [...columns];
  if (can('users-edit|users-ban|users-delete')) {
    const actionsColumn: ColumnDef<User> = {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const actionsPermissions = {
          edit: can('users-edit'),
          ban: can('users-ban') && row.original.id !== auth.user.id,
          delete: can('users-delete') && row.original.id !== auth.user.id,
        };

        if (!Object.values(actionsPermissions).some((item) => item)) {
          return <></>;
        }

        return (
          <div className="flex justify-end">
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Открыть меню</span>
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {can('users-edit') && (
                    <DropdownMenuItem asChild>
                      <Link href={route('users.edit', row.original.id)}>
                        <Pen className="h-4 w-4" />
                        Редактировать
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {can('users-ban') && row.original.id !== auth.user.id && (
                    <>
                      {row.original.has_ban ? (
                        <DropdownMenuItem onClick={() => handleUnban(row.original.id)}>
                          <div className="flex items-center gap-2">
                            <CircleOff className="size-4" />
                            Разбанить
                          </div>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleBan(row.original.id)}>
                          <div className="flex items-center gap-2">
                            <Ban className="size-4" />
                            Забанить
                          </div>
                        </DropdownMenuItem>
                      )}
                      {can('users-delete') && row.original.id !== auth.user.id && (
                        <DropdownMenuSeparator />
                      )}
                    </>
                  )}

                  {can('users-delete') && row.original.id !== auth.user.id && (
                    <DropdownMenuItem asChild>
                      <AlertDialogTrigger asChild>
                        <div className="flex items-center gap-2 text-red-400">
                          <Trash className="h-4 w-4" />
                          Удалить
                        </div>
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent className="max-w-sm lg:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Пользователь будет удален без возможности
                    восстановления.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      className="dark:text-white"
                      onClick={() => handleDelete(row.original.id)}
                    >
                      Удалить
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    };
    allColumns.push(actionsColumn);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Пользователи" />

      <div className="space-y-6 p-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Пользователи</h1>
            <p className="text-muted-foreground">
              Управление пользователями и их ролями в системе.
            </p>
          </div>
          <Link href={route('users.create')}>
            <Button className="w-full md:w-auto" size="sm">
              <Plus />
              Добавить пользователя
            </Button>
          </Link>
        </div>

        <DataTable
          columns={allColumns}
          data={users.data}
          paginatedData={users}
          bulkActions={bulkActions}
        />
      </div>
    </AppLayout>
  );
}
