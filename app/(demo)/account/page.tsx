"use client";


import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layouts";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Account() {

    return (
        <>
            <ContentLayout title="Account Settings">
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
                            <BreadcrumbLink asChild>
                                <Link href="/excel-sheet">Sheet Created</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Account Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="mt-10">
                    <CardHeader>
                        <CardTitle>Account Control</CardTitle>
                        <CardDescription>Here you can display all the settings that exits for your account and visualization data.</CardDescription>
                    </CardHeader>

                    <CardContent>

                    </CardContent>

                </Card>
                {/* <div className="content-layout py-6 px-8 mt-8 rounded-lg shadow-lg bg-white dark:bg-gray-900 transition-colors duration-150">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        Pilih Spreadsheet untuk Visualisasi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Di halaman ini, Anda dapat memilih spreadsheet dari daftar yang tersedia untuk memvisualisasikan data.
                        Setelah memilih, Anda akan diarahkan ke halaman visualisasi. Pilihan terakhir Anda juga akan ditampilkan.
                    </p>


                </div> */}
            </ContentLayout >
        </>
    );
}



