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
import { DataTable } from '@/components/Table/data-table';
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
} from "@/components/ui/tooltip"

type DataRow = {
    name: string;
    gender: string;
    batch: string;
    age: string;
    major: string;
};

type StoredData = {
    spreadsheetId: string;
    range: string;
};

type ChartDataProps = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
};

type Node = {
    id: string;
    data: { label: string };
    position: { x: number; y: number };
};

type Edge = {
    id: string;
    source: string;
    target: string;
};

type ERDData = {
    nodes: Node[];
    edges: Edge[];
};


const transformFetchedData = (fetchedData: string[][]): DataRow[] => {
    return fetchedData.map(row => ({
        name: row[0] || "",
        gender: row[1] || "",
        batch: row[2] || "",
        age: row[3] || "",
        major: row[4] || "",
    }));
};

const transformToChartData = (data: DataRow[]): ChartDataProps => {
    const labels = data.map(row => row.name);
    const datasetData = data.map(row => Number(row.age) || 0);

    return {
        labels,
        datasets: [
            {
                label: 'Ages',
                data: datasetData,
                backgroundColor: ['rgba(75, 192, 192, 0.6)'],
            },
        ],
    };
};

const transformToPieDoughnutData = (data: DataRow[]): ChartDataProps => {
    const genderCounts = data.reduce((acc, row) => {
        acc[row.gender] = (acc[row.gender] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(genderCounts);
    const datasetData = Object.values(genderCounts);

    return {
        labels,
        datasets: [
            {
                label: 'Gender Distribution',
                data: datasetData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
            },
        ],
    };
}

const transformToERDData = (data: DataRow[]): ERDData => {
    const radius = 200;
    const centerX = 250;
    const centerY = 250;

    const nodes = data.map((row, index) => ({
        id: String(index + 1),
        data: { label: row.name },
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
    const [data, setData] = useState<DataRow[]>([]);
    const [erdData, setErdData] = useState<ERDData>({ nodes: [], edges: [] });
    const [chartType, setChartType] = useState<'bar' | 'line' | 'radar' | 'polarArea' | 'bubble' | 'scatter'
    >("line");
    const [showChart, setShowChart] = useState(true);
    const toggleChartVisibility = () => setShowChart(!showChart);



    useEffect(() => {
        const { spreadsheetId, rangeId } = params;
        console.log('URL : ' , spreadsheetId, rangeId);

        if (spreadsheetId && rangeId) {
            const storedData = localStorage.getItem('spreadsheetLinks');
            console.log(storedData);

            if (storedData) {
                const parsedData: StoredData[] = JSON.parse(storedData);
                const decodedRangeId = decodeURIComponent(rangeId);
                const matchedItem = parsedData.find((item: StoredData) =>
                    item.spreadsheetId === spreadsheetId && item.range === decodedRangeId
                );

                if (matchedItem) {
                    setSpreadsheetIdState(matchedItem.spreadsheetId);
                    setRangeState(matchedItem.range);
                    fetchSheetData(matchedItem.spreadsheetId, matchedItem.range)
                        .then(fetchedData => {
                            if (fetchedData) {
                                const transformedData = transformFetchedData(fetchedData);
                                setData(transformedData);
                                setErdData(transformToERDData(transformedData));
                            } else {
                                // router.push('/404');
                            }
                        })
                        .catch(() => {
                            // router.push('/404');
                        });
                } else {
                    // router.push('/404');
                }
            } else {
                // router.push('/404');
            }
        } else {
            // router.push('/404');
        }
    }, [params, router]);

    const handleNodeDragStop = (nodeId: string, newPosition: { x: number; y: number }) => {
        setErdData((prevErdData: ERDData) => {
            const updatedNodes = prevErdData.nodes.map(node => {
                if (node.id === nodeId) {
                    return { ...node, position: newPosition };
                }
                return node;
            });
            return { ...prevErdData, nodes: updatedNodes };
        });
    };

    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Gender", accessor: "gender" },
        { header: "Batch", accessor: "batch" },
        { header: "Age", accessor: "age" },
        { header: "Major", accessor: "major" },
    ];

    const chartData = transformToChartData(data);
    const pieDoughnutData = transformToPieDoughnutData(data);
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
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className={`${chartType !== type ? "bg-red-500 text-white" : ""
                                                            }`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <button
                                            onClick={toggleChartVisibility}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            {showChart ? "Hide Chart" : "Show Chart"}
                                        </button>
                                    </div>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <CircleHelp className='bg-blue-600/5 text-slate-100/5 rounded-full cursor-pointer' />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to Learn More</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                            </div>
                            <DataTable columns={columns} data={data} />
                            <div className="flex flex-col gap-2">
                                {showChart && <VisualizationChart data={chartData} chartType={chartType} />}
                                <div className="grid grid-cols-2 gap-4 mt-10">
                                    <div className="flex flex-col items-center">
                                        <h2 className="text-center">Pie Chart</h2>
                                        <PieDoughnutChart data={pieDoughnutData} chartType="pie" />
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <h2 className="text-center">Doughnut Chart</h2>
                                        <PieDoughnutChart data={pieDoughnutData} chartType="doughnut" />
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="py-10 px-6 border rounded-lg shadow-md mt-6">
                            <h2 className="text-xl font-semibold mb-4">Entity-Relationship Diagram (ERD)</h2>
                            <InteractiveERD
                                onNodeDragStop={handleNodeDragStop}
                                nodes={erdData.nodes}
                                edges={erdData.edges}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-red-500">Data tidak tersedia.</p>
                )}
            </div>
        </ContentLayout>
    );
}
