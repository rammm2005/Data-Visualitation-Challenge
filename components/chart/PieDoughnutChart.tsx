"use client";

import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

type ChartDataProps = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
};

type PieDoughnutChartProps = {
    data: ChartDataProps;
    chartType?: 'pie' | 'doughnut';
};

const PieDoughnutChart = ({ data, chartType = 'pie' }: PieDoughnutChartProps) => {
    const defaultColors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'];

    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor.length ? dataset.backgroundColor : defaultColors
        })),
    };

    return (
        <>
            {chartType === 'pie' ? (
                <Pie data={chartData} />
            ) : (
                <Doughnut data={chartData} />
            )}
        </>
    );
};

export default PieDoughnutChart;
