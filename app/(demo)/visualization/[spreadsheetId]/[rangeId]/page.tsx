"use client";

import { useEffect, useState } from 'react';
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
import { VisualizationPageProps } from '@/types/visualUrl';
import { useRouter } from 'next/navigation';

type Data = {
    spreadsheetId: string;
    range: string;
};

export default function VisualizationPage({ params }: VisualizationPageProps) {
    const router = useRouter();
    const [spreadsheetIdState, setSpreadsheetIdState] = useState<string | null>(null);
    const [rangeState, setRangeState] = useState<string | null>(null);

    useEffect(() => {
        const { spreadsheetId, rangeId } = params;
        console.log('url', spreadsheetId, rangeId);

        if (spreadsheetId && rangeId) {
            const storedData = localStorage.getItem('spreadsheetLinks');
            console.log('storage', storedData);

            if (storedData) {
                const parsedData: Data[] = JSON.parse(storedData);
                const decodedRangeId = decodeURIComponent(rangeId);
                const matchedItem = parsedData.find((item: Data) =>
                    item.spreadsheetId === spreadsheetId && item.range === decodedRangeId
                );

                console.log('Matched Item:', matchedItem);
                console.log('Looking for:', spreadsheetId, decodedRangeId);

                if (matchedItem) {
                    setSpreadsheetIdState(matchedItem.spreadsheetId);
                    setRangeState(matchedItem.range);
                } else {
                    router.push('/404');
                }
            } else {
                router.push('/404');
            }
        } else {
            router.push('/404');
        }
    }, [params, router]);

    return (
        <ContentLayout title="Visualisasi Data">
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
                        <BreadcrumbPage>Visualisasi Data</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <h1>Visualisasi Data</h1>
                {spreadsheetIdState && rangeState ? (
                    <>
                        <p>Spreadsheet ID: {spreadsheetIdState}</p>
                        <p>Range: {rangeState}</p>
                    </>
                ) : (
                    <p className="text-red-500">Data tidak tersedia.</p>
                )}
            </div>
        </ContentLayout>
    );
}
