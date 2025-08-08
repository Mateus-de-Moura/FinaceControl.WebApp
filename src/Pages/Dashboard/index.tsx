"use client"
import { SectionCards } from "@/components/ui/section-cards"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { GetDashboard } from "@/Services/dashboardServices";
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import TransactionCard from "./Transactions";
import { Group } from 'lucide-react';

const chartConfig = {
    desktop: {
        label: "Receitas",
        color: "rgb(46, 107, 240)",
    },
    mobile: {
        label: "Despesas",
        color: "rgb(238, 29, 29)",
    },
} satisfies ChartConfig

export default function Page() {

    const dashboardQuery = useQuery({
        queryKey: ['dashboard'],
        queryFn: GetDashboard,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
    const dashboard = dashboardQuery.data?.data;

    const chartData = dashboard?.monthlySummary.map((monthData: any) => ({
        month: monthData.month,
        desktop: monthData.revenues,
        mobile: monthData.expenses,
    }))

    return (
        <div className="flex flex-1 flex-col min-h-screen">
            <div className="@container/main flex flex-1 flex-col ">
                <div className="pl-5 pt-5">
                    <Card className="p-3  md:gap-2  w-[98%]">
                        <div className="flex flex-row gap-3">
                            <Group className="text-blue-700" />
                            <h6 className="text-blue-700 font-semibold">DashBoard</h6>
                        </div>
                           <div className="flex flex-row gap-3">                            
                            <p>Monitoramento de finanças em tempo real</p>
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col gap-5 py-4 md:gap-6 md:py-4">
                    <SectionCards />
                </div>
                <div className="flex flex-col md:flex-row w-[98%] felx-1">
                    <div className="w-[70%]">
                        <div className="pl-6 pr-4 h-screen w-[390px] md:w-full md:h-screen">
                            <Card className="p-5">
                                <CardHeader>
                                    <CardTitle>Gestão anual</CardTitle>
                                    <CardDescription>Janeiro - Dezembro</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig}>
                                        <BarChart accessibilityLayer data={chartData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={true}
                                                tickMargin={10}
                                                axisLine={true}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                            <ChartLegend content={<ChartLegendContent />} />
                                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <TransactionCard />
                </div>
            </div>
        </div>
    )
}
