'use client'

import { AvatarDropdown } from "@/components/common/avatar-dropdown"
import {ProfileFormValues} from "@/lib/zod-schema/profile";
import cookies from "js-cookie";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface LayoutProps {
    children: React.ReactNode;
    user?: ProfileFormValues
}

export function MainLayout({ children, user }: LayoutProps) {
    const router = useRouter()

    const handleLogout = () => {
        // Implement your logout logic here
        cookies.remove('token');

        window.location.href = '/auth';
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-background border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My App</h1>
                    {user ? <AvatarDropdown user={user} onLogout={handleLogout}/> : <Button onClick={() => router.push('/auth') }>Sign In</Button>}
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}

