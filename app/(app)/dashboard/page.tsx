import { getDashboardStats, getSpendingTrend, getCategoryBreakdown } from "@/app/actions/dashboard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart";
import { MonthlyReportWidget } from "@/components/reports/MonthlyReportWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, Activity, DollarSign } from "lucide-react";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const trend = await getSpendingTrend();
    const breakdown = await getCategoryBreakdown();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Spend (Today)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalDailySpend.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Fixed: ₹{stats.fixedDailyCost.toFixed(2)} + Var: ₹{stats.todaysVariable.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Daily Average Cost
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.fixedDailyCost.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.recurringCount} recurring bills
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Variable Spend (Today)
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.todaysVariable.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Across daily entries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Variable Spend (Month)
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.monthlyVariable.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            This calendar month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-full">
                    <MonthlyReportWidget />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart data={trend} />
                <CategoryBreakdownChart data={breakdown} />
            </div>
        </div>
    );
}
