"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';




export function WykresGradLin({ catego }) {
    const pb = new PocketBase('http://172.16.15.146:8080');
    // const pb = new PocketBase('http://192.168.60.25:8080');

    pb.autoCancellation(false)

    const [danen, setDanen] = useState({})
    const [chartConfig2, setChartConfig2] = useState([])

    const chartConfig = {
    sesions: {
        label: "liczba sesji",
         color: "#008050",
  },}

    const getRandomColor = ()=> {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // console.log(color)
    return color;
    }

    useEffect(() => {
        const getData = async () => {
            const chartConfigObj = {};

            const results = await Promise.all(
                catego.map(async (item) => {
                    const records = await pb.collection('sesions').getFullList({
                        sort: '-created',
                        filter: `kategoriaID='${item.id}'`
                    });
                    const randomColor = getRandomColor();
                    console.log(randomColor)
                    chartConfigObj[item.skrot] = {label: item.skrot};
                    return { month: item.skrot, sesions: records.length, fill: `${randomColor}` };
                })
            );

            setChartConfig2(chartConfigObj);
            setDanen(results); // set everything at once
        };

        getData();
    }, []);

    // const chartData = danen

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Wykres</TabsTrigger>
                <TabsTrigger value="password">Wykres kołowy</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader className="items-center pb-4">
                        <CardTitle>Radar Chart - Lines Only</CardTitle>
                        <CardDescription>
                            Showing total visitors for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadarChart data={danen}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <PolarAngleAxis dataKey="month" />
                                <PolarGrid radialLines={false} />
                                <Radar
                                    dataKey="sesions"
                                    fill="var(--color-sesions)"
                                    fillOpacity={0.2}
                                    stroke="var(--color-sesions)"
                                    strokeWidth={2}
                                />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="password">
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Radial Chart</CardTitle>
                        <CardDescription>ile sesji jakich sesji</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chartConfig2}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadialBarChart data={danen} innerRadius={30} outerRadius={110}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel nameKey="month" />}
                                />
                                <RadialBar dataKey="sesions" background />
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </TabsContent>
        </Tabs>

    )
}
