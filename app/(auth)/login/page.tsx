import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
