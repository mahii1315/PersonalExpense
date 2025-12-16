"use client";

import { useEffect, useState } from "react";
import { getMonthlyReport } from "@/app/actions/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryPieChart } from "./CategoryPieChart";
import { Loader2 } from "lucide-react";

export function MonthlyReportWidget() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear.toString());
    const [month, setMonth] = useState(currentMonth.toString());
    const [data, setData] = useState<{ totalSpend: number, pieData: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getMonthlyReport(parseInt(year), parseInt(month));
                setData(result);
            } catch (error) {
                console.error("Failed to fetch monthly report", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]);

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center">
                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-full flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Monthly Spend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <div className="text-4xl font-bold">
                                ₹{data?.totalSpend.toFixed(2)}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="h-[400px]">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <CategoryPieChart data={data?.pieData || []} />
                    )}
                </div>
            </div>
        </div>
    );
}
