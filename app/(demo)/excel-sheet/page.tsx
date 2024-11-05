"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { FormSchema } from "@/types/sheet";
import { FileSymlink, Edit, Trash, Loader } from "lucide-react";
import { getSpreadsheetIdAndRange } from "@/lib/getSpreadshetIds";
import { ContentLayout } from "@/components/admin-panel/content-layouts";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Table/data-table";

const isValidSpreadsheetLink = (link: string) => {
    const googleSpreadsheetRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/;
    return googleSpreadsheetRegex.test(link);
};

export default function ExcelSheet() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<{ id: string; link: string; spreadsheetId: string; range: string }[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            link: "",
            range: "",
        },
    });

    useEffect(() => {
        const savedLinks = localStorage.getItem("spreadsheetLinks");
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }
    }, []);

    const columns: ColumnDef<{ id: string; link: string; spreadsheetId: string; range: string }>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => {
                const index = row.index + 1;
                return <span className="w-12">{index}</span>;
            },
        },
        {
            accessorKey: "link",
            header: "Link",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "spreadsheetId",
            header: "Spreadsheet ID",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "range",
            header: "Range",
            cell: (info) => info.getValue(),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() => handleEdit(row.original.id)}
                        className="mr-2"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];


    const saveToLocalStorage = (newLinks: { id: string; link: string }[]) => {
        localStorage.setItem("spreadsheetLinks", JSON.stringify(newLinks));
    };

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true);

        if (!isValidSpreadsheetLink(data.link)) {
            form.setError("link", { type: "manual", message: "Please enter a valid Google Spreadsheet link." });
            setLoading(false);
            return;
        }

        const parsedData = getSpreadsheetIdAndRange(data.link, data.range);

        if (!parsedData) {
            form.setError("link", { type: "manual", message: "Invalid Google Spreadsheet link." });
            setLoading(false);
            return;
        }

        const { spreadsheetId } = parsedData;
        const range = data.range || parsedData.range;

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (editingId) {
                const updatedLinks = links.map((item) =>
                    item.id === editingId
                        ? {
                            ...item,
                            link: data.link,
                            spreadsheetId,
                            range: data.range,
                            updated_at: new Date().toISOString(),
                        }
                        : item
                );
                setLinks(updatedLinks);
                saveToLocalStorage(updatedLinks);
            } else {
                const newLink = {
                    id: uuidv4(),
                    link: data.link,
                    spreadsheetId,
                    range,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                const updatedLinks = [...links, newLink];
                setLinks(updatedLinks);
                saveToLocalStorage(updatedLinks);
            }

            toast({
                title: "Success! Spreadsheet Link Added",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            });

            form.reset();
        } catch {
            toast({
                title: "Error",
                description: "An error occurred while adding the spreadsheet link.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };



    const handleEdit = (id: string) => {
        const linkToEdit = links.find((item) => item.id === id);
        if (linkToEdit) {
            form.setValue("link", linkToEdit.link);
            form.setValue("range", linkToEdit.range);
            setEditingId(id);
        }
    };
    const handleDelete = (id: string) => {
        const updatedLinks = links.filter((item) => item.id !== id);
        setLinks(updatedLinks);
        saveToLocalStorage(updatedLinks);
        toast({
            title: "Link Deleted",
            variant: "default",
        });
    };

    return (
        <ContentLayout title="Sheet Link Data">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Sheet Link</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-6 mt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Spreadsheet Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your Google Spreadsheet link..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public Spreadsheet link that we use to visualize data.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="range"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Range</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the spreadsheet range (e.g., 'Sheet1!A1:D100')"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can specify the range for data extraction (e.g., Sheet1!A1:D100). If left blank, a default range will be used.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button type="submit" disabled={loading} className="flex items-center">
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="spinning mr-3" />
                                    {editingId ? "Updating..." : "Checking..."}
                                </span>
                            ) : (
                                <>
                                    <FileSymlink className="mr-2 h-4 w-4" />
                                    {editingId ? "Update" : "Submit"}
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>


            <div className="mt-8">
                <DataTable columns={columns} data={links} />
            </div>
            {/* Links Table */}
            {/* <div className="mt-8">
                <table className="table-auto w-full border-collapse border border-slate-500">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 px-4 py-2">Link</th>
                            <th className="border border-slate-600 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center p-4">No Links Found</td>
                            </tr>
                        ) : (
                            links.map((item) => (
                                <tr key={item.id}>
                                    <td className="border border-slate-600 px-4 py-2">{item.link}</td>
                                    <td className="border border-slate-600 px-4 py-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleEdit(item.id)}
                                            className="mr-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div> */}
        </ContentLayout>
    );
}
