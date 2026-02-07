"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";
import { ComponentType, ReactNode, useState } from "react";
import type {
  Table as ReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type TTableComp = "tableHead" | "tableCell" | "tableRow";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  search?: boolean;
  searchText?: string;
  sortingEnabled?: boolean;
  initialSorting?: SortingState; // Changed from sortBy to support multiple sorting
  pageSize?: number;
  defaultHiddenColumns?: string[];
  HeaderComponent?: ComponentType<
    {
      table: ReactTable<TData>; // Pass table instance to custom header
      globalFilter?: string;
      setGlobalFilter?: (value: string) => void;
      columnFilters?: ColumnFiltersState;
      setColumnFilters?: (filters: ColumnFiltersState) => void;
      sorting?: SortingState;
      setSorting?: (sorting: SortingState) => void;
    } & Record<string, unknown>
  >;
  TableWraper?: ComponentType<{ children: ReactNode }>;
  classes?: Record<TTableComp, string>;
  enableRowSelection?: boolean;
  enableMultiSort?: boolean; // Enable multiple column sorting
  enableColumnFilters?: boolean; // Enable individual column filters
  initialColumnFilters?: ColumnFiltersState; // Initial column filters
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  search,
  searchText,
  initialSorting = [{ id: "updatedAt", desc: true }],
  sortingEnabled = true,
  pageSize,
  HeaderComponent,
  TableWraper,
  defaultHiddenColumns,
  classes,
  enableMultiSort = false,
  enableColumnFilters = false,
  enableRowSelection = false,
  initialColumnFilters = [],
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      defaultHiddenColumns?.reduce((acc, col) => {
        acc[col] = false;
        return acc;
      }, {} as VisibilityState) ?? {},
  );

  // const sortingState =
  //   sortingEnabled && sortBy
  //     ? [{ id: sortBy, desc: true }]
  //     : [{ id: "updatedAt", desc: true }];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiSort,
    enableSorting: sortingEnabled,
    enableRowSelection: enableRowSelection,
    enableMultiRowSelection: enableRowSelection,

    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: initialSorting,
      columnFilters: initialColumnFilters,
      columnVisibility: defaultHiddenColumns?.reduce((acc, col) => {
        acc[col] = false;
        return acc;
      }, {} as VisibilityState),
      pagination: pagination
        ? {
            pageSize: pageSize || 5,
          }
        : undefined,
    },
  });

  const tableContent = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  "border-e last:border-0 font-bold bg-zinc-100 dark:bg-zinc-800 whitespace-nowrap",
                  classes?.tableHead,
                )} //
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="last:border-b">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "border-e last:border-0 whitespace-nowrap",
                    classes?.tableCell,
                  )}
                >
                  {" "}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const headerContent = (
    <>
      {search ? (
        <div className="flex items-center py-2">
          <Input
            placeholder={searchText || "Search all columns..."}
            value={globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="flex-grow md:max-w-sm bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" //
          />
        </div>
      ) : (
        <div></div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {HeaderComponent ? (
          <HeaderComponent
            table={table}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            sorting={sorting}
            setSorting={setSorting}
          />
        ) : (
          headerContent
        )}
      </div>
      <div className="rounded-md border overflow-x-auto">
        {TableWraper ? <TableWraper>{tableContent}</TableWraper> : tableContent}
      </div>
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
