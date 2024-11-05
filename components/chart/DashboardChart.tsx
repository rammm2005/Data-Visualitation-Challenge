"use client";

import React, { useEffect, useState, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
    month: string;
    created: number;
    updated: number;
}

export const description = "A multiple bar chart";

const chartConfig = {
    created: {
        label: "Created At",
        color: "hsl(var(--chart-1))",
    },
    updated: {
        label: "Updated At",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function DashboardChart() {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const fetchLocalStorageData = useCallback(() => {
        const storedLinks = localStorage.getItem("spreadsheetLinks");
        if (storedLinks) {
            const links = JSON.parse(storedLinks);
            const aggregatedData = aggregateDataByMonth(links);
            setChartData(aggregatedData);
        }
    }, []);

    const aggregateDataByMonth = (data: { created_at: string; updated_at: string }[]) => {
        const monthlyData: Record<string, ChartData> = {};

        data.forEach((item) => {
            const createdAt = new Date(item.created_at);
            const updatedAt = new Date(item.updated_at);

            const createdMonth = createdAt.toLocaleString("default", { month: "long" });
            const updatedMonth = updatedAt.toLocaleString("default", { month: "long" });

            if (!monthlyData[createdMonth]) {
                monthlyData[createdMonth] = { month: createdMonth, created: 0, updated: 0 };
            }
            if (!monthlyData[updatedMonth]) {
                monthlyData[updatedMonth] = { month: updatedMonth, created: 0, updated: 0 };
            }

            monthlyData[createdMonth].created += 1;
            monthlyData[updatedMonth].updated += 1;
        });

        return Object.values(monthlyData);
    };

    useEffect(() => {
        fetchLocalStorageData();
    }, [fetchLocalStorageData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Created vs. Updated</CardTitle>
                <CardDescription>Data Aggregated Per Month</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
                        <Bar dataKey="updated" fill="var(--color-updated)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    All the Data Spreadsheet all time <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing created and updated entries per month
                </div>
            </CardFooter>
        </Card>
    );
}
