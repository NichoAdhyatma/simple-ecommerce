import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {useToast} from "@/hooks/use-toast";

export function useLogin() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle error dari server
                setError(result.message || 'Login failed');
                console.log(result.message);
                toast({
                        title: 'Error',
                        description: result.message || 'Login failed',
                        variant: 'destructive'
                    }
                )
                setIsLoading(false);
                return false;
            }

            // Simpan token di cookies
            Cookies.set('token', result.data, {
                expires: 1, // 1 hari
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // Redirect ke dashboard atau halaman utama setelah login
            router.push('/');

            setIsLoading(false);
            return true;
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
            toast({
                    title: 'Error',
                    description: `${err}`,
                    variant: 'destructive'
                }
            )
            return false;
        }
    };

    return {login, error, isLoading};
}
