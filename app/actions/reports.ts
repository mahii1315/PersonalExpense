"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    return session.user.id;
}

const CATEGORY_MAPPINGS: Record<string, string> = {
    // Medical
    "Pharmacy": "Medical",
    "Doctor Visits": "Medical",
    "Hospital": "Medical",
    "Medicines": "Medical",

    // Food
    "Dining Out": "Food",
    "Travel Food": "Food",
    "Snacks & Beverages": "Food",
    "Snacks": "Food",
    "Beverages": "Food",
    "Food Delivery": "Food",

    // Transport
    "Fuel": "Transport",
    "Cab / Ride-hailing": "Transport",
    "Cab": "Transport",
    "Public Transport": "Transport",
    "Parking & Tolls": "Transport",
    "Parking": "Transport",
    "Tolls": "Transport",
    "Vehicle Maintenance": "Transport",

    // Essentials
    "Rent": "Housing",
    "EMI / Loans": "Loans",
    "Electricity": "Utilities",
    "Water": "Utilities",
    "Gas": "Utilities",
    "Internet": "Utilities",
    "Mobile": "Utilities",
};

export async function getMonthlyReport(year: number, month: number) {
    const userId = await getUserId();

    // Create dates for the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1. Fetch Variable Expenses (Daily)
    const dailyExpenses = await prisma.dailyExpense.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: { category: true },
    });

    // 2. Fetch Recurring Expenses
    // We include all recurring expenses that are active during this period
    const recurringExpenses = await prisma.recurringExpense.findMany({
        where: {
            userId,
            startDate: { lte: endDate },
            OR: [
                { endDate: null },
                { endDate: { gte: startDate } },
            ],
        },
        include: { category: true },
    });

    // 3. calculate totals and group by consolidated category
    let totalSpend = 0;
    const categoryMap = new Map<string, number>();

    // Process Daily Expenses
    dailyExpenses.forEach((exp: any) => {
        totalSpend += exp.amount;
        const catName = exp.category.name;
        const consolidatedName = CATEGORY_MAPPINGS[catName] || catName;
        categoryMap.set(consolidatedName, (categoryMap.get(consolidatedName) || 0) + exp.amount);
    });

    // Process Recurring Expenses
    recurringExpenses.forEach((exp: any) => {
        let amountForMonth = 0;
        if (exp.frequency === "MONTHLY") {
            amountForMonth = exp.amount;
        } else if (exp.frequency === "YEARLY") {
            amountForMonth = exp.amount / 12;
        }

        totalSpend += amountForMonth;
        const catName = exp.category.name;
        const consolidatedName = CATEGORY_MAPPINGS[catName] || catName;
        categoryMap.set(consolidatedName, (categoryMap.get(consolidatedName) || 0) + amountForMonth);
    });

    // Format data for Pie Chart
    const pieData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value,
    })).sort((a, b) => b.value - a.value);

    return {
        totalSpend,
        pieData,
    };
}
