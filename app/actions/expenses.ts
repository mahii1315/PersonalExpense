"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function getUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    return session.user.id;
}

const DailyExpenseSchema = z.object({
    amount: z.number().positive(),
    date: z.date(), // or string if passed from form, usually date picker returns Date object or string
    note: z.string().optional(),
    categoryId: z.string(),
    paymentMode: z.enum(["CASH", "CARD", "UPI"]).default("UPI"),
});

const RecurringExpenseSchema = z.object({
    name: z.string().min(1),
    amount: z.number().positive(),
    frequency: z.enum(["MONTHLY", "YEARLY"]),
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
    categoryId: z.string(),
    note: z.string().optional(),
});

export async function addDailyExpense(data: z.infer<typeof DailyExpenseSchema>) {
    try {
        const userId = await getUserId();
        const expense = await prisma.dailyExpense.create({
            data: {
                ...data,
                userId,
            },
        });
        revalidatePath("/dashboard");
        revalidatePath("/daily-expenses");
        return { success: true, expense };
    } catch (error) {
        console.error("Failed to add daily expense:", error);
        return { error: "Failed to add expense" };
    }
}

export async function addRecurringExpense(data: z.infer<typeof RecurringExpenseSchema>) {
    try {
        const userId = await getUserId();
        const expense = await prisma.recurringExpense.create({
            data: {
                ...data,
                userId,
            },
        });
        revalidatePath("/dashboard");
        revalidatePath("/recurring-expenses");
        return { success: true, expense };
    } catch (error) {
        console.error("Failed to add recurring expense:", error);
        return { error: "Failed to add recurring expense" };
    }
}

export async function getDailyExpenses() {
    const userId = await getUserId();
    return prisma.dailyExpense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: "desc" },
    });
}

export async function getRecurringExpenses() {
    const userId = await getUserId();
    return prisma.recurringExpense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCategories() {
    const userId = await getUserId();
    let categories = await prisma.category.findMany({
        where: { userId },
    });

    const defaultCategories = [
        // Essentials
        { name: "Rent", type: "FIXED", icon: "Home" },
        { name: "EMI / Loans", type: "FIXED", icon: "Banknote" },
        { name: "Electricity", type: "FIXED", icon: "Zap" },
        { name: "Water", type: "FIXED", icon: "Droplets" },
        { name: "Gas", type: "FIXED", icon: "Flame" },
        { name: "Internet", type: "FIXED", icon: "Wifi" },
        { name: "Mobile", type: "FIXED", icon: "Smartphone" },
        { name: "Insurance", type: "FIXED", icon: "Shield" },
        { name: "Taxes", type: "FIXED", icon: "FileText" },
        { name: "Maintenance", type: "FIXED", icon: "Tool" },

        // Food & Daily Needs
        { name: "Groceries", type: "VARIABLE", icon: "ShoppingCart" },
        { name: "Dining Out", type: "VARIABLE", icon: "Utensils" },
        { name: "Food Delivery", type: "VARIABLE", icon: "Truck" },
        { name: "Snacks & Beverages", type: "VARIABLE", icon: "Coffee" },

        // Transport
        { name: "Fuel", type: "VARIABLE", icon: "Fuel" },
        { name: "Public Transport", type: "VARIABLE", icon: "Bus" },
        { name: "Cab / Ride-hailing", type: "VARIABLE", icon: "Car" },
        { name: "Vehicle Maintenance", type: "VARIABLE", icon: "Wrench" },
        { name: "Parking & Tolls", type: "VARIABLE", icon: "Ticket" },

        // Lifestyle & Entertainment
        { name: "Movies", type: "VARIABLE", icon: "Film" },
        { name: "OTT Subscriptions", type: "FIXED", icon: "Tv" },
        { name: "Music", type: "FIXED", icon: "Music" },
        { name: "Gaming", type: "VARIABLE", icon: "Gamepad" },
        { name: "Events", type: "VARIABLE", icon: "Calendar" },
        { name: "Hobbies", type: "VARIABLE", icon: "Palette" },

        // Shopping
        { name: "Clothing", type: "VARIABLE", icon: "Shirt" },
        { name: "Footwear", type: "VARIABLE", icon: "Footprints" },
        { name: "Electronics", type: "VARIABLE", icon: "Laptop" },
        { name: "Online Shopping", type: "VARIABLE", icon: "ShoppingBag" },
        { name: "Accessories", type: "VARIABLE", icon: "Watch" },

        // Health & Wellness
        { name: "Medical", type: "VARIABLE", icon: "Stethoscope" },
        { name: "Pharmacy", type: "VARIABLE", icon: "Pill" },
        { name: "Doctor Visits", type: "VARIABLE", icon: "UserPlus" },
        { name: "Gym / Fitness", type: "FIXED", icon: "Dumbbell" },
        { name: "Mental Wellness", type: "VARIABLE", icon: "Brain" },

        // Travel
        { name: "Flights", type: "VARIABLE", icon: "Plane" },
        { name: "Hotels", type: "VARIABLE", icon: "Hotel" },
        { name: "Local Travel", type: "VARIABLE", icon: "MapPin" },
        { name: "Travel Food", type: "VARIABLE", icon: "Utensils" },
        { name: "Travel Shopping", type: "VARIABLE", icon: "ShoppingBag" },

        // Education
        { name: "Courses", type: "FIXED", icon: "BookOpen" },
        { name: "Books", type: "VARIABLE", icon: "Book" },
        { name: "Online Learning", type: "FIXED", icon: "Monitor" },
        { name: "Exams & Certifications", type: "VARIABLE", icon: "Award" },

        // Subscriptions
        { name: "Streaming", type: "FIXED", icon: "Play" },
        { name: "Software", type: "FIXED", icon: "Disc" },
        { name: "Cloud Services", type: "FIXED", icon: "Cloud" },

        // Personal & Misc
        { name: "Gifts", type: "VARIABLE", icon: "Gift" },
        { name: "Donations", type: "VARIABLE", icon: "Heart" },
        { name: "Personal Care", type: "VARIABLE", icon: "Smile" },
        { name: "Miscellaneous", type: "VARIABLE", icon: "HelpCircle" },
    ];

    const existingNames = new Set(categories.map((c: any) => c.name));
    const newCategories = defaultCategories.filter((c: any) => !existingNames.has(c.name));

    if (newCategories.length > 0) {
        await prisma.category.createMany({
            data: newCategories.map((c) => ({
                ...c,
                userId,
            })),
        });

        categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    return categories;
}

export async function deleteDailyExpense(id: string) {
    try {
        const userId = await getUserId();
        await prisma.dailyExpense.delete({
            where: { id, userId },
        });
        revalidatePath("/dashboard");
        revalidatePath("/daily-expenses");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete daily expense:", error);
        return { error: "Failed to delete expense" };
    }
}

export async function deleteRecurringExpense(id: string) {
    try {
        const userId = await getUserId();
        await prisma.recurringExpense.delete({
            where: { id, userId },
        });
        revalidatePath("/dashboard");
        revalidatePath("/recurring-expenses");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete recurring expense:", error);
        return { error: "Failed to delete expense" };
    }
}
