"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";

interface CategoryBreakdownChartProps {
    data: {
        name: string;
        value: number;
        color: string | null;
    }[];
}

const COLORS = [
    "#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6", "#34495e", "#1abc9c", "#e67e22", "#95a5a6"
];

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
