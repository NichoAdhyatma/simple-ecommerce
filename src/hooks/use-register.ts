import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useToast} from "@/hooks/use-toast";
import {RegisterInput} from "@/lib/zod-schema/auth";

export function useRegister() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();

    const register = async (registerFormData: RegisterInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerFormData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Registration failed');
                setIsLoading(false);
                toast({
                        title: 'Error',
                        description: result.message || 'Registration failed',
                    }
                )
                return false;
            }

            window.location.href = '/auth';

            setIsLoading(false);
            return true;
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
            toast({
                    title: 'Error',
                    description: `${err}`,
                }
            )
            return false;
        }
    };

    return { register, error, isLoading };
}
