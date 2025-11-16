import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import usePermissions from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import { BulkAction, PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { ChevronDown, Copy, FilterX, MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  paginatedData: PaginatedData<TData>;
  className?: string;
  bulkActions?: BulkAction<TData>[];
}

export default function DataTableToolbar<TData>({
  table,
  paginatedData,
  className = '',
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const { query_params } = paginatedData;
  const { can } = usePermissions();

  const [bulkActionsOpen, setBulkActionsOpen] = useState<boolean>(false);

  const handleDebouncedSearch = useDebouncedCallback((value: string) => {
    const routerOptions = {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    };

    if (value.length > 2 && value !== query_params.search) {
      router.get(
        route(route().current() ?? ''),
        {
          ...query_params,
          search: value,
          page: 1,
        },
        routerOptions,
      );
    } else if (value.length === 0) {
      const updatedQueryParams = { ...query_params, page: 1 };
      delete updatedQueryParams.search;

      router.get(route(route().current() ?? ''), updatedQueryParams, routerOptions);
    }
  }, 500);

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  const resetFilters = () => {
    router.get(route(route().current() ?? ''))
  };

  return (
    <>
      <div className={cn('flex items-center justify-between gap-4', className)}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Поиск..."
              className="max-w-sm pl-8"
              defaultValue={query_params.search ?? ''}
              onChange={(e) => handleDebouncedSearch(e.target.value)}
            />
          </div>

          <div className="flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={resetFilters}>
                  <FilterX />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Сбросить фильтры</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {bulkActions &&
          bulkActions.length > 0 &&
          bulkActions.some((action) => can(action.permissions)) && (
            <DropdownMenu
              open={bulkActionsOpen}
              onOpenChange={(open) => !open && setBulkActionsOpen(false)}
            >
              <DropdownMenuTrigger asChild onClick={() => setBulkActionsOpen((prev) => !prev)}>
                <Button variant="outline">
                  <MoreVertical />
                  Действия
                  {/*({selectedRows.length})*/}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit">
                {bulkActions
                  .filter((action) => can(action.permissions))
                  .map((action, index) => (
                    <div key={index}>
                      <DropdownMenuItem
                        className={action.className}
                        disabled={typeof action.forAll === 'undefined' && selectedRows.length === 0}
                        onSelect={(e) => {
                          e.preventDefault();
                          action.onClick(selectedRows);
                          if (typeof action.alertDialog === 'undefined') {
                            setBulkActionsOpen(false);
                          }
                          if (action.clearSelected) {
                            table.toggleAllPageRowsSelected(false);
                          }
                        }}
                      >
                        {action.icon && <action.icon className="size-4 text-inherit" />}
                        {action.label}
                      </DropdownMenuItem>
                      {action.alertDialog && (
                        <AlertDialog
                          open={action.alertDialog.open}
                          onOpenChange={(open) => !open && setBulkActionsOpen(false)}
                        >
                          <AlertDialogContent className="max-w-sm lg:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>{action.alertDialog.title}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {action.alertDialog.description}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  action.alertDialog?.onClose();
                                  setBulkActionsOpen(false);
                                }}
                              >
                                Отмена
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  action.alertDialog?.onClick(selectedRows);
                                  action.alertDialog?.onClose();
                                  setBulkActionsOpen(false);
                                  table.toggleAllPageRowsSelected(false);
                                }}
                                asChild
                              >
                                <Button variant="destructive" className="dark:text-white">
                                  {action.alertDialog.actionText}
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
    </>
  );
}
