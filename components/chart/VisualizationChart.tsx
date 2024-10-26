"use client";

import { Chart } from "react-chartjs-2";
// import { useEffect, useState } from "react";

type ChartDataProps = {
    labels: string[];
    data: number[];
};

const VisualizationChart = ({ data }: { data: ChartDataProps }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "Jumlah Siswa",
                data: data.data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return <Chart type="bar" data={chartData} />;
};

export default VisualizationChart;
