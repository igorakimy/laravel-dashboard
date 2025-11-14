import DataTableColumnHeader from '@/components/datatable/datatable-column-header';
import DataTablePagination from '@/components/datatable/datatable-pagination';
import DataTableToolbar from '@/components/datatable/datatable-toolbar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BulkAction, PaginatedData } from '@/types';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginatedData: PaginatedData<TData>;
  bulkActions?: BulkAction<TData>[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  paginatedData,
  bulkActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: paginatedData.meta.current_page,
    pageSize: paginatedData.meta.per_page,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const allColumns = [...columns];

  if (bulkActions && bulkActions?.length > 0) {
    const checkboxColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select All"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    allColumns.unshift(checkboxColumn);
  }

  const processedColumns = allColumns.map((column) => {
    if (!column.enableSorting || !paginatedData) {
      return column;
    }

    if (typeof column.header === 'function') {
      return column;
    }

    if ('accessorKey' in column && typeof column.header === 'string') {
      const columnWithAccessor = column as ColumnDef<TData, TValue> & {
        accessorKey: string;
        header: string;
      };
      return {
        ...column,
        header: ({ column: col }: { column: Column<TData, unknown> }) => (
          <DataTableColumnHeader
            column={col}
            title={columnWithAccessor.header}
            queryParams={paginatedData.query_params}
          />
        ),
      };
    }

    return column;
  });

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: paginatedData.meta.total,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      {paginatedData && (
        <DataTableToolbar
          table={table}
          paginatedData={paginatedData}
          className="mb-3"
          bulkActions={bulkActions}
        />
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={processedColumns.length} className="h-24 text-center">
                  {paginatedData && paginatedData.query_params.search !== ''
                    ? 'Ничего не найдено.'
                    : 'Нет записей.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginatedData && <DataTablePagination table={table} paginatedData={paginatedData} />}
    </div>
  );
}
