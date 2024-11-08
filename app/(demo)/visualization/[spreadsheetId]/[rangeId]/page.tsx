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
import { DataRow, StoredData, ChartDataProps, Node, NodeDataType, Edge, ERDData } from '@/types/data';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { LoadingIndicator } from '@/components/loading/loading';
import { Card } from '@/components/ui/card';

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

// export const transformToChartData = (data: DataRow<string>[]): ChartDataProps<string> => {
//     const labels = data.map(row => row.Nama);
//     const datasetData = data.map(row => Number(row.Status) || 0);

//     const backgroundColors = labels.map((_, index) => {
//         const hue = (index * 360) / labels.length;
//         return `hsla(${hue}, 70%, 40%, 1)`;
//     });

//     return {
//         labels,
//         datasets: [
//             {
//                 label: 'Ages',
//                 data: datasetData,
//                 backgroundColor: backgroundColors,
//             },
//         ],
//     };
// };

export const transformToChartData = (
    data: DataRow<string>[],
    filterBy: 'graduates' | 'active' | 'fakultas',
    faculty?: string
): ChartDataProps<string> => {
    let countsByCategory: Record<string, number> = {};

    if (filterBy === 'graduates') {
        countsByCategory = data.reduce((acc, row) => {
            const graduationYear = row.TMT;
            if (graduationYear) {
                const formattedMonthYear = formatMonthYear(graduationYear);
                acc[formattedMonthYear] = (acc[formattedMonthYear] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
    } else if (filterBy === 'active') {
        countsByCategory = data.reduce((acc, row) => {
            const status = row.aktif || row.Status;
            const learningStatus = status?.toLowerCase() === 'aktif (belajar)' ? 'aktif (belajar)' : 'tidak aktif (belajar)';
            acc[learningStatus] = (acc[learningStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    } else if (filterBy === 'fakultas') {
        countsByCategory = data.reduce((acc, row) => {
            if (faculty) {
                if (row.Jurusan === faculty) {
                    const facultyName = row.Jurusan;
                    acc[facultyName] = (acc[facultyName] || 0) + 1;
                }
            } else {
                const facultyName = row.Jurusan;
                acc[facultyName] = (acc[facultyName] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
    }

    const labels = Object.keys(countsByCategory);
    const datasetData = labels.map((label) => countsByCategory[label]);

    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 50%, 0.2)`;
    });
    const borderColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 40%, 1)`;
    });

    const datasetLabel =
        filterBy === 'graduates' ? 'Graduates' : filterBy === 'active' ? 'Active Students' : 'Fakultas Data';

    return {
        labels,
        datasets: [
            {
                label: datasetLabel,
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



export const transformChartSemester = (data: DataRow<string>[]): ChartDataProps<string> => {
    const semesterCounts = data.reduce((acc, row) => {
        const smt = row.Semester || row.semester || row.smt;
        if (smt) {
            const semester = parseInt(smt, 10);
            if (semester >= 3 && semester <= 14) {
                acc[semester] = (acc[semester] || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<number, number>);

    const labels = Array.from({ length: 12 }, (_, i) => `Semester ${i + 3}`);

    const datasetData = labels.map((_, index) => semesterCounts[index + 3] || 0);

    const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / labels.length;
        return `hsla(${hue}, 70%, 50%, 0.6)`;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Semester',
                data: datasetData,
                backgroundColor: backgroundColors,
            },
        ],
    };
};




// export const transformToChartDataLogICAllWork = (
//     data: DataRow<string>[],
//     filterBy: 'graduates' | 'active',
//     faculty?: string
// ): ChartDataProps<string> => {
//     const filteredData = data.filter((row) => {
//         if (faculty && row.Fakultas !== faculty) {
//             return false;
//         }
//         if (filterBy === 'graduates') {
//             return row.Status === 'Graduated';
//         } else if (filterBy === 'active') {
//             return row.Status === 'Active';
//         }
//         return true;
//     });

//     const chartData = filteredData.map((row) => {
//         const graduationYear = row.TMT || row.tamat || row.Tamat || row.tmt;
//         const year = graduationYear ? new Date(graduationYear).getFullYear() : 0;
//         const value = Number(row.StatusValue) || 0;
//         const size = Math.random() * 20 + 5;

//         return { x: year, y: value, r: size };
//     });

//     const backgroundColors = chartData.map((_, index) => {
//         const hue = (index * 360) / chartData.length;
//         return `hsla(${hue}, 70%, 50%, 0.4)`;
//     });

//     const borderColors = chartData.map((_, index) => {
//         const hue = (index * 360) / chartData.length;
//         return `hsla(${hue}, 70%, 40%, 1)`;
//     });

//     return {
//         labels: [],
//         datasets: [
//             {
//                 label: filterBy === 'graduates' ? 'Graduates' : 'Active Students',
//                 data: chartData,
//                 backgroundColor: backgroundColors,
//                 borderColor: borderColors,
//                 borderWidth: 2,
//                 hoverBackgroundColor: borderColors,
//                 hoverBorderColor: borderColors,
//             },
//         ],
//     };
// };

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
            const formattedMonthYear = formatMonthYear(graduationYear);
            const date = formatDate(graduationYear);
            acc[formattedMonthYear] = acc[formattedMonthYear] || { count: 0, dates: {} };
            acc[formattedMonthYear].count += 1;

            acc[formattedMonthYear].dates[date] = (acc[formattedMonthYear].dates[date] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, { count: number, dates: Record<string, number> }>);

    const labels = Object.keys(graduationCounts);
    const datasetData = labels.map(label => graduationCounts[label].count);
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

const formatMonthYear = (dateString: string): string => {
    const parts = dateString.split('/');
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${monthNames[monthIndex]} ${year}`;
};

const formatDate = (dateString: string): string => {
    const parts = dateString.split('/');
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${day} ${monthNames[monthIndex]} ${year}`;
};

export const getGraduationDetails = (data: DataRow<string>[], selectedMonthYear: string): Record<string, number> => {
    const graduationDetails: Record<string, number> = {};

    data.forEach(row => {
        const graduationYear = row.TMT || row.tamat || row.Tamat || row.tmt || row.TMT || row.Tamat;
        if (graduationYear) {
            const monthYear = formatMonthYear(graduationYear);
            const date = formatDate(graduationYear);

            if (monthYear === selectedMonthYear) {
                graduationDetails[date] = (graduationDetails[date] || 0) + 1;
            }
        }
    });

    return graduationDetails;
};



export const transformActiveLearningChart = (data: DataRow<string>[]): ChartDataProps<string> => {
    const activeCounts = data.reduce((acc, row) => {
        const kendala = row.kendala || row.Kendala;

        const learningStatus = kendala?.toLowerCase().includes('iya') ? 'ada kendala (belajar)' : 'tidak ada kendala (belajar)';
        acc[learningStatus] = (acc[learningStatus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const activeLearningCount = activeCounts['ada kendala (belajar)'] || 0;
    const inactiveLearningCount = activeCounts['tidak ada kendala (belajar)'] || 0;

    const labels = ['ada kendala (belajar)', 'tidak ada kendala (belajar)'];

    const datasetData = [activeLearningCount, inactiveLearningCount];

    const backgroundColors = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'];

    if (activeLearningCount === 0 && inactiveLearningCount === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Status Belajar',
                data: [],
                backgroundColor: backgroundColors,
                borderWidth: 1,
            }],
        };
    }

    return {
        labels,
        datasets: [
            {
                label: 'Status Belajar',
                data: datasetData,
                backgroundColor: backgroundColors,
                borderWidth: 1,
            },
        ],
    };
};








export const transformToERDData = (data: DataRow<string>[]): ERDData<string> => {
    const radius = 200;
    const centerX = 250;
    const centerY = 250;

    const nodes = data.map((row, index) => {
        const fields = Object.keys(row).map(key => {
            const fieldType: NodeDataType = getTypeFromValue(row[key]);

            return {
                name: key,
                type: fieldType,
                isPK: key === 'id',
                isFK: false
            };
        });

        return {
            id: String(index + 1),
            data: {
                label: `${row.Nama}\n${fields.map(f => `${f.name}: ${f.type}${f.isPK ? ' (PK)' : ''}${f.isFK ? ' (FK)' : ''}`).join('\n')}`,
                type: 'Normal' as NodeDataType
            } as { label: string; type: NodeDataType },
            position: {
                x: centerX + radius * Math.cos((index / data.length) * 2 * Math.PI),
                y: centerY + radius * Math.sin((index / data.length) * 2 * Math.PI)
            }
        } as Node<string>;
    });

    const edges = nodes.map((node, index) => ({
        id: `e${node.id}-${(index + 2).toString()}`,
        source: node.id,
        target: (index + 2).toString()
    })).filter((_, index) => index < nodes.length - 1);

    return { nodes, edges };
};

const getTypeFromValue = (value: string | number | null): NodeDataType => {
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return 'Number';
    return 'Normal';
};



export const chartUserIPK = (data: DataRow[], selectedNames: string[]): { chartData: ChartDataProps, ipk: number[] } => {
    const ipkValues = selectedNames.map(selectedNama => {
        const selectedData = data.find(row => row['Nama Lengkap'] === selectedNama);
        return selectedData && selectedData['IPK'] !== null ? Number(selectedData['IPK']) : 0;
    });

    const chartData = {
        labels: selectedNames,
        datasets: [
            {
                label: 'IPK',
                data: ipkValues,
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return { chartData, ipk: ipkValues };
};



export const chartUserIPKBelow = (
    data: DataRow[],
    ipkCategory: 'below2' | 'between2and3' | 'above3',
    chartType: 'bar' | 'line' | 'pie' | 'radar' | 'polarArea' | 'bubble' | 'scatter'
): { chartData: ChartDataProps, ipk: number[], totalPeople: number, totalPeopleChartData: ChartDataProps } => {

    const filterCriteria = {
        below2: (ipk: number) => ipk < 2,
        between2and3: (ipk: number) => ipk >= 2 && ipk <= 3,
        above3: (ipk: number) => ipk > 3,
    };

    const filteredData = data.filter(row =>
        row['IPK'] !== null && filterCriteria[ipkCategory](Number(row['IPK']))
    );

    const selectedNames = filteredData.map(row => row['Nama Lengkap']);
    const ipkValues = filteredData.map(row => row['IPK'] ? Number(row['IPK']) : 0);

    const totalPeople = filteredData.length;

    let chartData: ChartDataProps = {
        labels: selectedNames,
        datasets: [
            {
                label: 'IPK',
                data: ipkValues,
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    // if (chartType === 'bubble' || chartType === 'scatter') {
    //     chartData = {
    //         labels: selectedNames,
    //         datasets: [
    //             {
    //                 label: 'IPK',
    //                 data: ipkValues.map((ipk, index) => ({
    //                     x: index,
    //                     y: ipk,
    //                     r: 5,
    //                 })),
    //                 backgroundColor: ['rgba(75, 192, 192, 0.2)'],
    //                 borderColor: ['rgba(75, 192, 192, 1)'],
    //                 borderWidth: 1,
    //             },
    //         ],
    //     };
    // }


    const totalPeopleChartData = {
        labels: [ipkCategory],
        datasets: [
            {
                label: 'Total People',
                data: [totalPeople],
                backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    if (chartType === 'pie') {
        chartData = {
            labels: [ipkCategory],
            datasets: [
                {
                    label: 'Total People in Category',
                    data: [totalPeople],
                    backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(153, 102, 255, 1)', 'rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                },
            ],
        };
    }


    return { chartData, ipk: ipkValues, totalPeople, totalPeopleChartData };
};


const chartIPKCategoryPieDoughnut = (
    data: DataRow[],
    chartType: 'pie' | 'doughnut'
): { chartData: ChartDataProps; totalPeople: number[] } => {
    const filterCriteria = {
        below2: (ipk: number) => ipk < 2,
        between2and3: (ipk: number) => ipk >= 2 && ipk <= 3,
        above3: (ipk: number) => ipk > 3,
    };

    const below2Data = data.filter(row => row['IPK'] !== null && filterCriteria.below2(Number(row['IPK'])));
    const between2and3Data = data.filter(row => row['IPK'] !== null && filterCriteria.between2and3(Number(row['IPK'])));
    const above3Data = data.filter(row => row['IPK'] !== null && filterCriteria.above3(Number(row['IPK'])));

    const totalBelow2 = below2Data.length;
    const totalBetween2and3 = between2and3Data.length;
    const totalAbove3 = above3Data.length;

    const chartData: ChartDataProps = {
        labels: ['Below 2', 'Between 2 and 3', 'Above 3'],
        datasets: [
            {
                label: 'Total People',
                data: [totalBelow2, totalBetween2and3, totalAbove3],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
            },
        ],
    };

    if (chartType === 'doughnut') {
        chartData.datasets[0].cutout = '70%';
    }

    return { chartData, totalPeople: [totalBelow2, totalBetween2and3, totalAbove3] };
};








// export const transformToERDData = (data: DataRow<string>[]): ERDData<string> => {
//     const radius = 200;
//     const centerX = 250;
//     const centerY = 250;

//     const nodes = data.map((row, index) => ({
//         id: String(index + 1),
//         data: { label: row.Nama },
//         position: {
//             x: centerX + radius * Math.cos((index / data.length) * 2 * Math.PI),
//             y: centerY + radius * Math.sin((index / data.length) * 2 * Math.PI)
//         }
//     }));

//     const edges = nodes.map((node, index) => ({
//         id: `e${node.id}-${(index + 2).toString()}`,
//         source: node.id,
//         target: (index + 2).toString()
//     })).filter((_, index) => index < nodes.length - 1);

//     return { nodes, edges };
// };

export default function VisualizationPage({ params }: VisualizationPageProps) {
    const router = useRouter();
    const [spreadsheetIdState, setSpreadsheetIdState] = useState<string | null>(null);
    const [rangeState, setRangeState] = useState<string | null>(null);
    const [data, setData] = useState<DataRow<string>[]>([]);
    const [erdData, setErdData] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
    const [chartType, setChartType] = useState<'bar' | 'line' | 'radar' | 'polarArea' | 'bubble' | 'scatter'>("line");
    const [showChart, setShowChart] = useState(true);
    const toggleChartVisibility = () => setShowChart(!showChart);
    const [columns, setColumns] = useState<ColumnDef<DataRow>[] | []>([]);
    const [filterBy, setFilterBy] = useState<'graduates' | 'active' | 'fakultas'>('graduates');
    const [selectedCategory, setSelectedCategory] = useState<'below2' | 'between2and3' | 'above3'>('below2');
    const [loading, setLoading] = useState({
        table: true,
        chart: true,
        secondChart: true,
        Erd: true,
    });
    const [selectedNama, setSelectedNama] = useState<string>('');
    const [chartData, setChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [selectedIPK, setSelectedIPK] = useState<number | null>(null);

    const uniqueNames = Array.from(new Set(data.map(row => row['Nama Lengkap'])));

    const handleCategoryChange = (category: 'below2' | 'between2and3' | 'above3') => {
        setSelectedCategory(category);
        const { chartData } = chartUserIPKBelow(data, category, chartType);
        setChartData(chartData);
    };

    const handleNamaChange = (nama: string) => {
        setSelectedNama(nama);
        setLoading(prev => ({ ...prev, chart: true }));

        const { chartData, ipk } = chartUserIPK(data, [nama]);

        setChartData(chartData);

        setSelectedIPK(ipk.length > 0 ? ipk[0] : null);

        setLoading(prev => ({ ...prev, chart: false }));
    };


    useEffect(() => {
        const { spreadsheetId, rangeId } = params;
        console.log('URL : ', spreadsheetId, rangeId);

        if (spreadsheetId && rangeId) {
            const storedData = localStorage.getItem('spreadsheetLinks');
            console.log('Stored Data: ', storedData);

            if (storedData) {
                try {
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
                } catch (error) {
                    console.error('Error parsing stored data:', error);
                }
            } else {
                console.error('No stored data found.');
            }
        } else {
            console.error('Invalid parameters.');
        }
    }, [params, router]);

    const handleNodeDragStop = (nodeId: string, position: { x: number; y: number }) => {
        setErdData(prevState => {
            const updatedNodes = prevState.nodes.map(node => {
                if (node.id === nodeId) {
                    return { ...node, position };
                }
                return node;
            });

            return { ...prevState, nodes: updatedNodes };
        });
    };


    const chartDatas = transformToChartData(data, filterBy);
    // const pieDoughnutData = transformToPieDoughnutData(data);
    const NimChart = transformChartNim(data);
    const ChartGraduation = transformGraduationChart(data);
    const aciveLearn = transformActiveLearningChart(data);
    const chartSemester = transformChartSemester(data);
    const ipkBelow = chartUserIPKBelow(data, selectedCategory, chartType);
    const ipkBelowPie = chartIPKCategoryPieDoughnut(data, 'pie');

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

            <div className='space-y-6'>
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


                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex flex-col gap-6 md:w-1/2">
                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Angkatan Overview</h2>
                                        <div className="">
                                            <PieDoughnutChart chartType='doughnut' data={NimChart} />
                                        </div>
                                    </div>

                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Semester Overview</h2>
                                        <div className="">
                                            <PieDoughnutChart chartType='pie' data={chartSemester} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 md:w-1/2">
                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Chart Kelulusan Overview</h2>
                                        <div className="h-[300px]">
                                            <VisualizationChart data={ChartGraduation} chartType='line' />
                                        </div>
                                    </div>

                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Chart Aktif Kuliah Overview</h2>
                                        <div className="h-[300px]">
                                            <VisualizationChart data={aciveLearn} chartType='bar' />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
                                {loading.table ? (
                                    <LoadingIndicator message="Loading Table..." />
                                ) : (
                                    <div className="md:w-full">
                                        <h2 className='text-xl font-bold mb-4'>Table Overview</h2>
                                        <DataTable data={data} columns={columns} initialPageSize={10} />
                                    </div>
                                )}
                            </div>

                            {/* {showChart && (
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
                            )} */}


                        </div>

                        {/* chart Chart IPK Students in range Overview */}
                        <Card>
                            <div className="px-5 py-5 mt-10">
                                <Select onValueChange={(value) => handleCategoryChange(value as 'below2' | 'between2and3' | 'above3')} defaultValue="between2and3">
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Select Chart Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['below2', 'between2and3', 'above3'].map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {showChart && (
                                    <div className="flex flex-col md:flex-row md:gap-10 md:items-start mt-5">
                                        {loading.chart ? (
                                            <LoadingIndicator message="Loading Chart IPK Student Line..." />
                                        ) : (
                                            <div className="md:w-full">
                                                <h2 className="text-xl font-bold mb-4">Chart IPK Students Overview</h2>
                                                <VisualizationChart data={ipkBelow.chartData} chartType={chartType} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>


                        {/* chart Chart Overview RAND */}
                        <Card>
                            <div className='mb-6 mt-6 px-5 py-5'>
                                <div className="flex flex-row gap-4 items-center filter-options mb-4">
                                    <label className="mr-4 flex flex-row gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="filterBy"
                                            value="graduates"
                                            checked={filterBy === 'graduates'}
                                            onChange={() => setFilterBy('graduates')}
                                        />
                                        Graduates
                                    </label>
                                    <label className="mr-4 flex flex-row gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="filterBy"
                                            value="active"
                                            checked={filterBy === 'active'}
                                            onChange={() => setFilterBy('active')}
                                        />
                                        Active Students
                                    </label>

                                    <label className="mr-4 flex flex-row gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="filterBy"
                                            value="fakultas"
                                            checked={filterBy === 'fakultas'}
                                            onChange={() => setFilterBy('fakultas')}
                                        />
                                        Fakultas
                                    </label>
                                    {/* <input
                                        type="text"
                                        placeholder="Enter Faculty (Optional)"
                                        value={faculty || ''}
                                        onChange={(e) => setFaculty(e.target.value || undefined)}
                                        className="ml-4 p-2 border rounded"
                                    /> */}
                                </div>

                                {showChart && (
                                    <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
                                        {loading.chart ? (
                                            <LoadingIndicator message="Loading Chart Line..." />
                                        ) : (
                                            <div className="md:w-full">
                                                <h2 className="text-xl font-bold mb-4">Chart Overview</h2>
                                                <VisualizationChart data={chartDatas} chartType={chartType} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>




                        {/* chart Chart IPK for spresifict Students Overview */}
                        <Card>
                            <div className="px-5 py-5 mt-10">
                                <Select onValueChange={handleNamaChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Nama Lengkap" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueNames.map(name => (
                                            <SelectItem key={name} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {showChart && (
                                    <div className="flex flex-col md:flex-row md:gap-10 md:items-start mt-5">
                                        {loading.chart ? (
                                            <LoadingIndicator message="Loading Chart IPK Line..." />
                                        ) : (
                                            <div className="md:w-full">
                                                <h2 className="text-xl font-bold mb-4 ">Chart IPK Overview</h2>
                                                {selectedNama && (
                                                    <div className="mt-4 mb-4 bg-blue-700/30 opacity-90 px-4 py-4 rounded-lg ">
                                                        <p className='text-lg font-semibold dark:text-slate-100 text-slate-950'><strong>Nama:</strong> {selectedNama}</p>
                                                        <p className='text-lg font-semibold dark:text-slate-100 text-slate-950'><strong>IPK:</strong> {selectedIPK !== null ? selectedIPK.toFixed(2) : 'Data tidak tersedia'}</p>
                                                    </div>
                                                )}
                                                <VisualizationChart data={chartData} chartType="bar" />
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                        </Card>

                        <div className="flex flex-row md:flex-row md:gap-10 md:items-start my-24">
                            {
                                loading.secondChart ? (
                                    <LoadingIndicator message="Loading Pie & Dounuts Charts..." />
                                ) : (
                                    <>
                                        <div className="md:w-1/2">
                                            <PieDoughnutChart data={ipkBelowPie.chartData} />
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
