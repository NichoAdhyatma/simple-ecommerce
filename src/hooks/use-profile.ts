import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {ProfileFormValues} from "@/lib/zod-schema/profile";
import {authHeader} from "@/lib/constant/header-http";

export const useProfile = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

    const updateProfile = async (data: ProfileFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/user", {
                method: "PATCH",
                headers: authHeader(),
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to update profile");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to update profile",
                    variant: "destructive",
                });
                return false;
            }

            setIsLoading(false);
            toast({
                title: "Success",
                description: "Profile updated successfully",
                variant: "success",
            });
            return true;
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            toast({
                title: "Error",
                description: `${err}`,
                variant: "destructive",
            });
            return false;
        }
    }

    const getUserProfile = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/user", {
                headers: authHeader(),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to get profile");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to get profile",
                    variant: "destructive",
                });
                return null;
            }

            setIsLoading(false);
            return result.data;
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            toast({
                title: "Error",
                description: `${err}`,
                variant: "destructive",
            });
            return null;
        }
    }



    return {updateProfile,getUserProfile, error, isLoading};
}