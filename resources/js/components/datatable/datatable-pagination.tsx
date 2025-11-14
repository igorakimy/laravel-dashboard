import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PER_PAGE_OPTIONS: number[] = [10, 20, 50, 100];

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  paginatedData: PaginatedData<TData>;
}

export default function DataTablePagination<TData>({
  table,
  paginatedData,
}: DataTablePaginationProps<TData>) {
  const { meta, links, query_params } = paginatedData;

  const handlePerPageChange = (value: number) => {
    router.get(
      route(route().current() ?? ''),
      {
        ...query_params,
        per_page: value,
        page: 1,
      },
      {
        preserveScroll: true,
      },
    );
  };

  const handlePageSelectChange = (value: number) => {
    router.get(
      route(route().current() ?? ''),
      {
        ...query_params,
        page: value,
      },
      {
        preserveScroll: true,
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-between px-2 py-2 md:flex-row">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} из{' '}
        {table.getFilteredRowModel().rows.length} строк выбрано
      </div>
      <div className="flex flex-col items-center space-y-2 space-x-6 md:flex-row md:space-y-0 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Записей на страницу</p>
          <Select
            value={meta.per_page.toString()}
            onValueChange={(value) => handlePerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {PER_PAGE_OPTIONS.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center space-x-2 text-sm font-medium">
          <span>Страница: </span>
          <Select
            value={meta.current_page.toString()}
            onValueChange={(value) => handlePageSelectChange(Number(value))}
          >
            <SelectTrigger className="w-fit/20 h-8">
              <SelectValue placeholder={meta.current_page} />
            </SelectTrigger>
            <SelectContent side="top" align="end" className="max-h-[160px]">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={`${page}`}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span> из {meta.last_page}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8 lg:flex"
            onClick={() => {
              router.get(
                route(route().current() ?? ''),
                { ...query_params, page: 1 },
                { preserveState: true, preserveScroll: true },
              );
            }}
            disabled={links.first === null || meta.current_page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              router.get(
                route(route().current() ?? ''),
                { ...query_params, page: meta.current_page - 1 },
                { preserveState: true, preserveScroll: true },
              );
            }}
            disabled={links.prev === null || meta.current_page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              router.get(
                route(route().current() ?? ''),
                { ...query_params, page: meta.current_page + 1 },
                { preserveState: true, preserveScroll: true },
              );
            }}
            disabled={links.next === null || meta.current_page === meta.last_page}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 lg:flex"
            onClick={() => {
              router.get(
                route(route().current() ?? ''),
                { ...query_params, page: meta.last_page ?? 1 },
                { preserveState: true, preserveScroll: true },
              );
            }}
            disabled={links.last === null || meta.current_page === meta.last_page}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
