"use client";

import {
    Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter
} from 'react-chartjs-2';
import {
    Chart, CategoryScale, LinearScale, BarElement, Title,
    LineElement, PointElement, ArcElement
} from 'chart.js';

type ChartDataProps = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
};

type VisualizationChartProps = {
    data: ChartDataProps;
    chartType?: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
};

Chart.register(CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement, ArcElement);

const VisualizationChart = ({ data, chartType = 'bar' }: VisualizationChartProps) => {
    const defaultColors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'];

    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor.length ? dataset.backgroundColor : defaultColors
        })),
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={chartData} />;
            case 'line':
                return <Line data={chartData} />;
            case 'pie':
                return <Pie data={chartData} />;
            case 'doughnut':
                return <Doughnut data={chartData} />;
            case 'radar':
                return <Radar data={chartData} />;
            case 'polarArea':
                return <PolarArea data={chartData} />;
            case 'bubble':
                return <Bubble data={chartData} />;
            case 'scatter':
                return <Scatter data={chartData} />;
            default:
                return <Bar data={chartData} />;
        }
    };

    return <>{renderChart()}</>;
};

const availableChartTypes = [
    'bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter',
];

export { VisualizationChart, availableChartTypes };
