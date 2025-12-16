import { getRecurringExpenses } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { DeleteExpenseButton } from "@/components/expenses/DeleteExpenseButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function RecurringExpensesPage() {
    const expenses = await getRecurringExpenses();

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Recurring Expenses</h1>
                <Link href="/recurring-expenses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {expenses.length === 0 ? (
                    <p className="text-slate-500">No recurring expenses set up.</p>
                ) : (
                    expenses.map((expense: any) => {
                        // Calculate daily cost approx
                        const dailyCost = expense.frequency === "MONTHLY"
                            ? expense.amount / 30
                            : expense.amount / 365;

                        return (
                            <Card key={expense.id}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{expense.name} <span className="text-xs text-slate-400">({expense.category.name})</span></p>
                                        <p className="text-sm text-slate-500">
                                            {expense.frequency} • {new Date(expense.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xl font-bold">₹{expense.amount.toFixed(2)}</div>
                                            <div className="text-xs text-slate-400">~₹{dailyCost.toFixed(2)}/day</div>
                                        </div>
                                        <DeleteExpenseButton id={expense.id} type="recurring" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
