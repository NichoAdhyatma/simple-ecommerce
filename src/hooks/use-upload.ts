import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {authHeader} from "@/lib/constant/header-http";

export function useUpload() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

    const upload = async (file: File) => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {...authHeader()},
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to upload file");
                setIsLoading(false)
                toast({
                    title: "Error",
                    description: result.message || "Failed to upload file",
                    variant: "destructive",
                })
                return null;
            }

            setIsLoading(false);
            return result.path;
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            toast({
                title: "Error",
                description: `${err}`,
                variant: "destructive",
            })
            return null;
        }
    };

    return {upload, error, isLoading};
}