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
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { VisualizationPageProps } from '@/types/visualUrl';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/Table/data-table-dync';
import { VisualizationChart } from '@/components/chart/VisualizationChart';
import { fetchSheetData } from '@/lib/fetchData';
import InteractiveERD from '@/components/ERD/InteractiveERD';
import { ChartArea, CircleHelp } from 'lucide-react';
import PieDoughnutChart from '@/components/chart/PieDoughnutChart';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataRow, StoredData, ChartDataProps, Node, Edge, ERDData } from '@/types/data';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { LoadingIndicator } from '@/components/loading/loading';

export const transformFetchedData = (fetchedData: string[][]): DataRow<string>[] => {
    const headers = fetchedData[0];
    return fetchedData.slice(1).map(row => {
        const rowData: DataRow<string> = {};
        headers.forEach((header, index) => {
            rowData[header] = row[index] || '';
        });
        return rowData;
    });
};

export const transformToChartData = (data: DataRow<string>[]): ChartDataProps<string> => {
    const labels = data.map(row => row.Nama);
    const datasetData = data.map(row => Number(row.Status) || 0);

    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 40%, 1)`;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Ages',
                data: datasetData,
                backgroundColor: backgroundColors,
            },
        ],
    };
};

export const transformToPieDoughnutData = (data: DataRow<string>[]): ChartDataProps<string> => {
    const genderCounts = data.reduce((acc, row) => {
        acc[row.Fakuktas] = (acc[row.Fakuktas] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(genderCounts);
    const datasetData = Object.values(genderCounts);
    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 50%, 0.2)`;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Fakultas Distribution',
                data: datasetData,
                backgroundColor: backgroundColors,
            },
        ],
    };
};

export const transformChartNim = (data: DataRow<string>[]): ChartDataProps<string> => {
    const cohortCounts = data.reduce((acc, row) => {
        const nim = row.NIM || row.nim || row.Nim;
        if (nim && nim.length >= 2) {
            const cohort = nim.slice(0, 2);
            acc[cohort] = (acc[cohort] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(cohortCounts).map(cohort => `Angkatan ${cohort}`);
    const datasetData = Object.values(cohortCounts);

    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 50%, 0.6)`;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Angkatan',
                data: datasetData,
                backgroundColor: backgroundColors,
            },
        ],
    };
};


export const transformGraduationChart = (data: DataRow<string>[]): ChartDataProps<string> => {
    const graduationCounts = data.reduce((acc, row) => {
        const graduationYear = row.TMT || row.tamat || row.Tamat || row.tmt || row.TMT || row.Tamat;
        if (graduationYear) {
            acc[graduationYear] = (acc[graduationYear] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(graduationCounts);
    const datasetData = Object.values(graduationCounts);
    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 50%, 0.2)`;
    });
    const borderColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 40%, 1)`;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Lulusan',
                data: datasetData,
                borderColor: borderColors,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };
};

export const transformActiveLearningChart = (data: DataRow<string>[]): ChartDataProps<string> => {
    const activeCounts = data.reduce((acc, row) => {
        const status = row.aktif || row.Status;
        const learningStatus = status && status.toLowerCase() === 'aktif' ? 'aktif (belajar)' : 'tidak aktif (belajar)';
        acc[learningStatus] = (acc[learningStatus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const labels = ['aktif (belajar)', 'tidak aktif (belajar)'];
    const datasetData = [
        activeCounts['aktif (belajar)'] || 0,
        activeCounts['tidak aktif (belajar)'] || 0
    ];

    const backgroundColors = labels.map((_, index) => {
        return index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)';
    });

    const borderColors = labels.map((_, index) => {
        return index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
    });

    return {
        labels,
        datasets: [
            {
                label: 'Status Belajar',
                data: datasetData,
                borderColor: borderColors,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };
};






export const transformToERDData = (data: DataRow<string>[]): ERDData<string> => {
    const radius = 200;
    const centerX = 250;
    const centerY = 250;

    const nodes = data.map((row, index) => ({
        id: String(index + 1),
        data: { label: row.Nama },
        position: {
            x: centerX + radius * Math.cos((index / data.length) * 2 * Math.PI),
            y: centerY + radius * Math.sin((index / data.length) * 2 * Math.PI)
        }
    }));

    const edges = nodes.map((node, index) => ({
        id: `e${node.id}-${(index + 2).toString()}`,
        source: node.id,
        target: (index + 2).toString()
    })).filter((_, index) => index < nodes.length - 1);

    return { nodes, edges };
};

export default function VisualizationPage({ params }: VisualizationPageProps) {
    const router = useRouter();
    const [spreadsheetIdState, setSpreadsheetIdState] = useState<string | null>(null);
    const [rangeState, setRangeState] = useState<string | null>(null);
    const [data, setData] = useState<DataRow<string>[]>([]);
    const [erdData, setErdData] = useState<ERDData<string>>({ nodes: [], edges: [] });
    const [chartType, setChartType] = useState<'bar' | 'line' | 'radar' | 'polarArea' | 'bubble' | 'scatter'>("line");
    const [showChart, setShowChart] = useState(true);
    const toggleChartVisibility = () => setShowChart(!showChart);
    // const [columns, setColumns] = useState<{ header: string; accessor: string; }[]>([]);
    const [columns, setColumns] = useState<ColumnDef<DataRow>[] | []>([]);
    const [loading, setLoading] = useState({
        table: true,
        chart: true,
        secondChart: true,
        Erd: true,
    });

    useEffect(() => {
        const { spreadsheetId, rangeId } = params;
        console.log('URL : ', spreadsheetId, rangeId);

        if (spreadsheetId && rangeId) {
            const storedData = localStorage.getItem('spreadsheetLinks');
            console.log('Stored Data: ', storedData);

            if (storedData) {
                const parsedData: StoredData[] = JSON.parse(storedData);
                const decodedRangeId = decodeURIComponent(rangeId);
                const matchedItem = parsedData.find((item: StoredData) =>
                    item.spreadsheetId === spreadsheetId && item.range === decodedRangeId
                );

                if (matchedItem) {
                    setLoading(prev => ({ ...prev, table: true, chart: true, secondChart: true, Erd: true }));
                    setSpreadsheetIdState(matchedItem.spreadsheetId);
                    setRangeState(matchedItem.range);
                    fetchSheetData(matchedItem.spreadsheetId, matchedItem.range)
                        .then(fetchedData => {
                            if (fetchedData && fetchedData.length > 0) {
                                console.log('Fetched Data: ', fetchedData);
                                const transformedData = transformFetchedData(fetchedData);

                                const headers = fetchedData[0];
                                const dynamicColumns = headers.map((header: string) => ({
                                    header: header,
                                    accessorKey: header,
                                    cell: (info: CellContext<DataRow, string | number>) => info.getValue()
                                })) as ColumnDef<DataRow>[];
                                setColumns(dynamicColumns);
                                setData(transformedData);

                                console.log('Data to DataTable:', transformedData);
                                console.log('Columns to DataTable:', dynamicColumns);
                                setErdData(transformToERDData(transformedData));
                            } else {
                                console.error('No data fetched.');
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching data: ', error);
                        })
                        .finally(() => {
                            setLoading(prev => ({ ...prev, table: false, chart: false, secondChart: false, Erd: false }));
                        });
                } else {
                    console.error('No matching item found.');
                }
            } else {
                console.error('No stored data found.');
            }
        } else {
            console.error('Invalid parameters.');
        }
    }, [params, router]);

    const handleNodeDragStop = (nodeId: string, newPosition: { x: number; y: number }) => {
        setErdData(prevErdData => {
            const updatedNodes = prevErdData.nodes.map(node => {
                if (node.id === nodeId) {
                    return { ...node, position: newPosition };
                }
                return node;
            });
            return { ...prevErdData, nodes: updatedNodes };
        });
    };

    const chartData = transformToChartData(data);
    const pieDoughnutData = transformToPieDoughnutData(data);
    const NimChart = transformChartNim(data);
    const ChartGraduation = transformGraduationChart(data);
    const aciveLearn = transformActiveLearningChart(data);

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
                <div className='mb-10 mt-6'>
                    <h1 className='text-2xl font-bold'>Visualisasi Data</h1>
                    <p className="text-gray-600 dark:text-slate-300">
                        This section provides a summary of the data available for analysis. You can explore various metrics and insights from the dataset.
                    </p>
                </div>

                {spreadsheetIdState && rangeState ? (
                    <>
                        <div className="py-10 px-6 grid grid-col-1 gap-10 border rounded-lg shadow-md">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-3 items-center">
                                    <h1 className='text-2xl font-bold'>Data Overview </h1>
                                    <ChartArea />
                                </div>
                                <div className="flex flex-row gap-3 items-center">
                                    <div className="flex gap-2">
                                        <Select onValueChange={(value) => setChartType(value as 'bar' | 'line' | 'bubble' | 'scatter')} defaultValue="line">
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select Chart Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['bar', 'line', 'bubble', 'scatter'].map(type => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <CircleHelp />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Select the type of chart to display your data visually.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <button onClick={toggleChartVisibility} className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                                        {showChart ? "Hide Chart" : "Show Chart"}
                                    </button>
                                </div>
                            </div>


                            <div className="flex flex-row gap-4 items-center">
                                <div className="md:w-1/2">
                                    <h2 className='text-xl font-bold mb-4'>Angkatan Overview</h2>
                                    <PieDoughnutChart chartType='doughnut' data={NimChart} />
                                </div>
                                <div className="flex flex-col gap-6 items-center w-full">
                                    <div className="md:w-1/2">
                                        <h2 className='text-xl font-bold mb-4'>Chart Kelulusan Overview</h2>
                                        <VisualizationChart data={ChartGraduation} chartType='line' />
                                    </div>
                                    <div className="md:w-1/2">
                                        <h2 className='text-xl font-bold mb-4'>Chart Kelulusan Overview</h2>
                                        <VisualizationChart data={aciveLearn} chartType='line' />
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
                                {loading.table ? (
                                    <LoadingIndicator message="Loading Table..." />
                                ) : (
                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Table Overview</h2>
                                        <DataTable data={data} columns={columns} />
                                    </div>
                                )}
                            </div>

                            {showChart && (
                                <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
                                    {loading.chart ? (
                                        <LoadingIndicator message="Loading Chart Line..." />
                                    ) : (
                                        <div className="md:w-full">
                                            <h2 className='text-xl font-bold mb-4'>Chart Overview</h2>
                                            <VisualizationChart data={chartData} chartType={chartType} />
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        <div className="flex flex-row md:flex-row md:gap-10 md:items-start my-24">
                            {
                                loading.secondChart ? (
                                    <LoadingIndicator message="Loading Pie & Dounuts Charts..." />
                                ) : (
                                    <>
                                        <div className="md:w-1/2">
                                            <PieDoughnutChart data={pieDoughnutData} />
                                        </div>
                                        <div className="md:w-1/2">
                                            <PieDoughnutChart chartType='doughnut' data={pieDoughnutData} />
                                        </div>
                                    </>
                                )
                            }

                        </div>

                        <div className="py-10 px-6 grid grid-col-1 gap-10 border rounded-lg shadow-md">
                            {
                                loading.Erd ? (
                                    <LoadingIndicator message="Loading ERD Data..." />
                                ) : (
                                    <>
                                        <h1 className='text-2xl font-bold'>Entity Relationship Diagram</h1>
                                        <InteractiveERD nodes={erdData.nodes} edges={erdData.edges} onNodeDragStop={handleNodeDragStop} />
                                    </>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <div>No Data Available</div>
                )}
            </div>
        </ContentLayout>
    );
}
