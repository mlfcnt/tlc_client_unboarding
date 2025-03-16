"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  Header,
  HeaderGroup,
  Row,
  Cell,
  Column,
} from "@tanstack/react-table";
import {ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react";
import * as React from "react";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {OnboardingStatuses} from "@/app/constants/OnboardingStatuses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";

// Updated type to match actual data structure
export type OnboardingRequest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  id_number: number;
  status: keyof typeof OnboardingStatuses;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<OnboardingRequest>[] = [
  {
    id: "select",
    header: () => null,
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id_number",
    header: ({column}: {column: Column<OnboardingRequest>}) => {
      return (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => <div>{row.getValue("id_number")}</div>,
    enableHiding: true,
  },
  {
    id: "name",
    header: "Name",
    cell: ({row}) => {
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;
      return <div>{`${firstName} ${lastName}`}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({row}) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
      const status = row.getValue("status") as keyof typeof OnboardingStatuses;
      const statusText = OnboardingStatuses[status];

      return (
        <div
          className={`capitalize font-medium rounded-full px-2.5 py-0.5 text-xs inline-flex items-center justify-center ${
            status === "test_requested" || status === "awaiting_payment_link"
              ? "bg-yellow-100 text-yellow-800"
              : status === "test_done" || status === "payed"
              ? "bg-green-100 text-green-800"
              : status === "denied_payment" || status === "refused_schedule"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({row}) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const request = row.original;
      const status = request.status;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="noShadow" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            {status === "test_requested" && (
              <>
                <DropdownMenuItem>Send test</DropdownMenuItem>
                <DropdownMenuItem>Cancel request</DropdownMenuItem>
              </>
            )}
            {status === "test_done" && (
              <DropdownMenuItem>Notify sales level</DropdownMenuItem>
            )}
            {status === "awaiting_payment_link" && (
              <DropdownMenuItem>Send payment link</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Contact client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const OnboardingDetailsGrid = ({
  filterByStatus,
}: {
  filterByStatus?: keyof typeof OnboardingStatuses;
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    filterByStatus ? [{id: "status", value: filterByStatus}] : []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id_number: false,
      created_at: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  // Apply filterByStatus when it changes
  React.useEffect(() => {
    if (filterByStatus) {
      setColumnFilters([{id: "status", value: filterByStatus}]);
    }
  }, [filterByStatus]);

  const {data, isLoading} = useQuery({
    queryKey: ["onboardingRequests"],
    queryFn: async () => {
      const {data, error} = await supabase.from("onboarding_requests").select();
      if (error) throw error;
      return data as OnboardingRequest[];
    },
  });

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: (filters) => {
      setColumnFilters(filters);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 1000, // Set a very large page size
      },
    },
    enableMultiRowSelection: false,
  });

  if (isLoading) return <div>Loading the onboarding details...</div>;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-screen-xl mx-auto">
      <div className="w-full font-base">
        <div className="flex items-center py-4">
          <Select
            onValueChange={(value: string) => {
              if (value === "all") {
                table.getColumn("status")?.setFilterValue(undefined);
                // Clear the column filter for status
                setColumnFilters(
                  columnFilters.filter((f) => f.id !== "status")
                );
              } else {
                table.getColumn("status")?.setFilterValue(value);
              }
            }}
            defaultValue={filterByStatus || "all"}
            value={
              columnFilters.find((f) => f.id === "status")
                ? (columnFilters.find((f) => f.id === "status")
                    ?.value as string)
                : "all"
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.entries(OnboardingStatuses).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="noShadow" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="font-heading ">
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<OnboardingRequest>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header: Header<OnboardingRequest, unknown>) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      }
                    )}
                  </TableRow>
                ))}
            </TableHeader>
            <TableBody>
              {table.getFilteredRowModel().rows?.length ? (
                table
                  .getFilteredRowModel()
                  .rows.map((row: Row<OnboardingRequest>) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<OnboardingRequest, unknown>) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      </div>
    </div>
  );
};
