"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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
import { Button } from '@/components/ui/button';
import { Loader2, FileSpreadsheet, Clock, Grid2x2Check, DatabaseZap, Search, Bird } from 'lucide-react';

export default function SpreadsheetSelection() {
    const router = useRouter();
    const [links, setLinks] = useState<{ id: string; link: string; spreadsheetId: string; range: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentChoice, setRecentChoice] = useState<{ link: string; spreadsheetId: string; range: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [birdPosition, setBirdPosition] = useState(0);
    const [birdDirection, setBirdDirection] = useState(1);


    const handleMouseMove = (e: MouseEvent) => {
        const windowWidth = window.innerWidth;
        const mouseX = e.clientX;

        const newPosition = ((mouseX / windowWidth) * 100) - 50;
        setBirdPosition(newPosition);

        setBirdDirection(mouseX < windowWidth / 2 ? -1 : 1);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const savedLinks = localStorage.getItem('spreadsheetLinks');
        const recentLink = localStorage.getItem('recentSpreadsheetChoice');

        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }

        if (recentLink) {
            setRecentChoice(JSON.parse(recentLink));
        }
    }, []);

    const handleSelect = (spreadsheetId: string, range: string, link: string) => {
        setLoading(true);
        localStorage.setItem('recentSpreadsheetChoice', JSON.stringify({ link, spreadsheetId, range }));
        router.push(`/visualization/${spreadsheetId}/${range}`);
    };

    const filteredLinks = links.filter(link =>
        link.link.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ContentLayout title="Sheet Choice">
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
                            <BreadcrumbPage>Sheet Visual Choose</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="content-layout py-6 px-8 mt-8 rounded-lg shadow-lg bg-white dark:bg-gray-900 transition-colors duration-150">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        Pilih Spreadsheet untuk Visualisasi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Di halaman ini, Anda dapat memilih spreadsheet dari daftar yang tersedia untuk memvisualisasikan data.
                        Setelah memilih, Anda akan diarahkan ke halaman visualisasi. Pilihan terakhir Anda juga akan ditampilkan.
                    </p>

                    {recentChoice && (
                        <div className="p-4 mb-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-sm flex items-center space-x-3">
                            <Clock className="h-6 w-6" />
                            <div>
                                <p className="text-sm font-semibold">Pilihan Terakhir:</p>
                                <p className="text-sm">{recentChoice.link}</p>
                            </div>
                        </div>
                    )}

                    {links.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition ease-in-out duration-150">
                                    {loading ? (
                                        <span className="flex items-center">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Mengarahkan...
                                        </span>
                                    ) : (
                                        <>
                                            <DatabaseZap className="h-5 w-5 text-slate-100 dark:text-slate-100 mr-1" />
                                            Pilih Spreadsheet
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full mt-2 rounded-lg shadow-lg border dark:border-gray-800 bg-white dark:bg-gray-800 transition-all duration-200">
                                <DropdownMenuLabel className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 text-lg font-semibold">
                                    <Grid2x2Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                    Spreadsheet Anda
                                </DropdownMenuLabel>

                                <div className="px-4 py-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full px-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Cari Spreadsheet..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {filteredLinks.length > 0 ? (
                                    filteredLinks.map((link) => (
                                        <DropdownMenuItem
                                            key={link.id}
                                            className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-150"
                                            onClick={() => handleSelect(link.spreadsheetId, link.range, link.link)}
                                        >
                                            <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                                            <span className="truncate text-gray-900 dark:text-gray-200">{link.link}</span>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="flex flex-col w-[32rem] items-center p-4 text-gray-500 dark:text-gray-400">
                                        <Bird className="h-20 w-20 mr-2"
                                            style={{
                                                transform: `translateX(${birdPosition}%) scaleX(${birdDirection})`,
                                                transition: 'transform 0.1s',
                                            }}
                                        />
                                        <span>Tidak ada hasil ditemukan.</span>
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                            Tidak ada link yang disimpan. <b><Link href="/excel-sheet">Click disini untuk menambahkan</Link></b>
                        </p>
                    )}
                </div>
            </ContentLayout>
        </>
    );
}



