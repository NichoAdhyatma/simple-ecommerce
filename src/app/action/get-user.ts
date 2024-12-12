import {cookies} from "next/headers";
import {ProfileFormValues} from "@/lib/zod-schema/profile";

export const getUserProfile = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const response = await fetch(`${process.env.API_URL}/api/user`, {
        headers: {
            'Authorization': `Bearer ${tokenCookie?.value.trim()}`,
        },
    });

    const result = await response.json();

    if (response.ok) {
        return result.data as ProfileFormValues;
    }
}
