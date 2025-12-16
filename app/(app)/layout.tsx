import { Sidebar } from "@/components/layout/Sidebar";
import AuthProvider from "@/providers/AuthProvider";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="h-full relative">
                <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                    <Sidebar />
                </div>
                <main className="md:pl-72 pb-10">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
