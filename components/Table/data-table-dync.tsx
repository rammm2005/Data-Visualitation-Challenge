import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    Row,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "../multi-select/select";
import { Bird, Turtle, Rabbit } from "lucide-react";

interface DataTableProps<TData extends Record<string, unknown>, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    initialPageSize?: number;
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
    columns,
    data,
    initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState(
        columns.map((col) => ({ header: col.header as string, visible: true }))
    );
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Bird
    const [birdPosition, setBirdPosition] = React.useState(0);
    const [birdDirection, setBirdDirection] = React.useState(1);

    // Turtle
    const [turtlePosition, setTurtlePosition] = React.useState(0);
    const [turtleDirection, setTurtleDirection] = React.useState(1);

    // Rabbit 
    const [rabbitPosition, setRabbitPosition] = React.useState(0);
    const [rabbitDirection, setRabbitDirection] = React.useState(1);

    const handleMouseMove = (e: MouseEvent) => {
        const windowWidth = window.innerWidth;
        const mouseX = e.clientX;

        const newPosition = ((mouseX / windowWidth) * 100) - 50;
        setBirdPosition(newPosition);
        setTurtlePosition(newPosition);
        setRabbitPosition(newPosition);

        setBirdDirection(mouseX < windowWidth / 2 ? -1 : 1);
        setTurtleDirection(mouseX < windowWidth / 2 ? -1 : 1);
        setRabbitDirection(mouseX < windowWidth / 2 ? -1 : 1);
    };

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const globalFilterFn = (row: Row<TData>) => {
        if (!filterValue) return true;
        return Object.values(row.original).some((value) =>
            String(value).toLowerCase().includes(filterValue.toLowerCase())
        );
    };

    const filteredData = React.useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(filterValue.toLowerCase())
            )
        );
    }, [data, filterValue]);

    const handleColumnVisibilityChange = (selectedColumns: string[]) => {
        setVisibleColumns(
            columns.map((col) => ({
                header: col.header as string,
                visible: selectedColumns.includes(col.header as string),
            }))
        );
    };

    const filteredColumns = React.useMemo(
        () =>
            columns.filter(
                (col) =>
                    visibleColumns.find((vc) => vc.header === col.header && vc.visible)
            ),
        [columns, visibleColumns]
    );

    const table = useReactTable({
        data: filteredData,
        columns: filteredColumns,
        state: {
            globalFilter: filterValue,
            pagination,
            sorting,
        },
        globalFilterFn: globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setFilterValue,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
                <Input
                    placeholder="Search..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full"
                />
                <MultiSelect
                    options={columns.map((col) => ({
                        label: col.header as string,
                        value: col.header as string,
                    }))}
                    onValueChange={handleColumnVisibilityChange}
                    defaultValue={columns.map((col) => col.header as string)}
                    placeholder="Select Columns"
                    className="w-full"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={() => header.column.toggleSorting()}
                                    className="cursor-pointer"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    {header.column.getIsSorted() === "asc" && " 🔼"}
                                    {header.column.getIsSorted() === "desc" && " 🔽"}
                                </TableHead>
                            ))
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
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
                                    className="h-[30vh]"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-lg font-medium">No results found.</div>
                                        <div className="flex flex-row items-center space-x-6 opacity-85">
                                            <Bird
                                                className="h-16 w-16 mt-4"
                                                style={{
                                                    transform: `translateX(${birdPosition}%) scaleX(${birdDirection})`,
                                                    transition: "transform 0.1s",
                                                }}
                                            />
                                            <Turtle className="h-20 w-20 mt-4"
                                                style={{
                                                    transform: `translateX(${turtlePosition}%) scaleX(${turtleDirection})`,
                                                    transition: "transform 0.1s",
                                                }}
                                            />
                                            <Rabbit
                                                className="h-16 w-16 mt-4"
                                                style={{
                                                    transform: `translateX(${rabbitPosition}%) scaleX(${rabbitDirection})`,
                                                    transition: "transform 0.1s",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                    )}
                </TableBody>

            </Table>

            <DataTablePagination table={table} />
        </div>
    );
}
