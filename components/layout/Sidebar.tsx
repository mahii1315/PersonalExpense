"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CalendarDays,
    CreditCard,
    Settings,
    LogOut,
    Wallet,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Daily Expenses",
        icon: CalendarDays,
        href: "/daily-expenses",
        color: "text-violet-500",
    },
    {
        label: "Recurring Expenses",
        icon: CreditCard,
        href: "/recurring-expenses",
        color: "text-pink-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Wallet className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Tracker</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="flex items-center p-3 text-sm font-medium text-zinc-400">
                    {session?.user?.name || "User"}
                </div>
                <div
                    onClick={() => signOut()}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};
