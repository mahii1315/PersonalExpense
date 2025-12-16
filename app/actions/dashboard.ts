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

export async function getDashboardStats() {
    const userId = await getUserId();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Recurring Expenses (Fixed Daily Cost)
    const recurring = await prisma.recurringExpense.findMany({
        where: { userId },
    });

    let fixedDailyCost = 0;
    recurring.forEach((exp) => {
        if (exp.frequency === "MONTHLY") {
            fixedDailyCost += exp.amount / 30; // Approx
        } else {
            fixedDailyCost += exp.amount / 365;
        }
    });

    // 2. Variable Expenses (Today)
    const todaysVariable = await prisma.dailyExpense.aggregate({
        where: {
            userId,
            date: {
                gte: today, // Greater than or equal to start of today
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than start of tomorrow
            }
        },
        _sum: { amount: true },
    });

    // 3. Variable Expenses (This Month)
    const monthlyVariable = await prisma.dailyExpense.aggregate({
        where: {
            userId,
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            }
        },
        _sum: { amount: true },
    });

    return {
        fixedDailyCost,
        todaysVariable: todaysVariable._sum.amount || 0,
        monthlyVariable: monthlyVariable._sum.amount || 0,
        totalDailySpend: (todaysVariable._sum.amount || 0) + fixedDailyCost,
        recurringCount: recurring.length
    };
}

export async function getSpendingTrend() {
    const userId = await getUserId();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const expenses = await prisma.dailyExpense.groupBy({
        by: ['date'],
        where: {
            userId,
            date: { gte: sevenDaysAgo }
        },
        _sum: { amount: true },
        orderBy: { date: 'asc' }
    });

    return expenses.map(e => ({
        date: new Date(e.date).toLocaleDateString(undefined, { weekday: 'short' }),
        amount: e._sum.amount || 0
    }));
}

export async function getCategoryBreakdown() {
    const userId = await getUserId();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await prisma.dailyExpense.groupBy({
        by: ['categoryId'],
        where: {
            userId,
            date: { gte: startOfMonth }
        },
        _sum: { amount: true },
    });

    // Fetch category names
    const categoryIds = expenses.map(e => e.categoryId);
    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, color: true }
    });

    const categoryMap = new Map(categories.map(c => [c.id, c]));

    return expenses.map(e => ({
        name: categoryMap.get(e.categoryId)?.name || 'Unknown',
        value: e._sum.amount || 0,
        color: categoryMap.get(e.categoryId)?.color || null
    })).sort((a, b) => b.value - a.value);
}
