import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { QueryParams } from '@/types';
import { router } from '@inertiajs/react';
import { Column } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  queryParams: QueryParams;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  queryParams,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = (direction: 'asc' | 'desc') => {
    router.get(
      route(route().current() ?? ''),
      {
        ...queryParams,
        sort_by: column.id,
        sort_dir: direction,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  return (
    <div className={cn('flex items-center gap-2')}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(queryParams?.sort_dir === 'asc' ? 'desc' : 'asc')}
      >
        <span>{title}</span>
        {queryParams?.sort_dir === 'desc' && queryParams?.sort_by === column.id ? (
          <ChevronDown />
        ) : queryParams?.sort_dir === 'asc' && queryParams?.sort_by === column.id ? (
          <ChevronUp />
        ) : (
          <ChevronsUpDown />
        )}
      </Button>
    </div>
  );
}
