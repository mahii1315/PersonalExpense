"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDailyExpense } from "@/app/actions/expenses";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
    amount: z.coerce.number().positive("Amount must be positive"),
    date: z.string(), // Input type="date" returns string
    categoryId: z.string().min(1, "Please select a category"),
    paymentMode: z.enum(["CASH", "CARD", "UPI"]),
    note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Category {
    id: string;
    name: string;
    type: string;
}

export function DailyExpenseForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            paymentMode: "UPI",
            note: "",
        },
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

    const onSubmit = async (data: FormValues) => {
        const result = await addDailyExpense({
            ...data,
            date: new Date(data.date),
        });

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/daily-expenses");
            router.refresh();
        }
    };

    const variableCategories = categories.filter(c => c.type === "VARIABLE");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Daily Expense</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" step="0.01" {...register("amount")} />
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register("date")} />
                        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...register("categoryId")}
                        >
                            <option value="">Select Category</option>
                            {variableCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="paymentMode">Payment Mode</Label>
                        <select
                            id="paymentMode"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...register("paymentMode")}
                        >
                            <option value="UPI">UPI</option>
                            <option value="CASH">Cash</option>
                            <option value="CARD">Card</option>
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input id="note" {...register("note")} />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Expense
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
