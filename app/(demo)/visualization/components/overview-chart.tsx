import { VisualizationChart } from "@/components/chart/VisualizationChart";
import { DataRow } from "@/types/data";
import { useState } from "react";
import { getGraduationDetails } from "../[spreadsheetId]/[rangeId]/page";

export const GraduationOverview = ({ data }: { data: DataRow<string>[] }) => {
    const [selectedMonth, setSelectedMonth] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value));
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    const selectedMonthYear = `${monthNames[selectedMonth]} ${selectedYear}`;

    const graduationDetails = getGraduationDetails(data, selectedMonthYear);

    const chartLabels = Object.keys(graduationDetails);
    const chartData = Object.values(graduationDetails);

    const chartDataset = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Jumlah Lulusan per Tanggal',
                data: chartData,
                backgroundColor: chartLabels.map(() => 'rgba(75, 192, 192, 0.2)'),
                borderColor: chartLabels.map(() => 'rgba(75, 192, 192, 1)'),
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="md:w-1/2">
            <h2 className='text-xl font-bold mb-4'>Chart Kelulusan Overview</h2>
            <div className="mb-4">
                <label className="mr-2">Pilih Bulan:</label>
                <select value={selectedMonth} onChange={handleMonthChange}>
                    {monthNames.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>
                <label className="mr-2 ml-4">Pilih Tahun:</label>
                <select value={selectedYear} onChange={handleYearChange}>
                    {[2020, 2021, 2022, 2023, 2024].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <VisualizationChart data={chartDataset} chartType='bar' />
        </div>
    );
};