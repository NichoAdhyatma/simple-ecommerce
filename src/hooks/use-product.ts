import {useState} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {ProductFormData} from "@/lib/zod-schema/product";
import {authHeader} from "@/lib/constant/header-http";
import {ApiResponse} from "@/lib/types/api-response";

export default function useProduct() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();

    const addProduct = async (productFormData: ProductFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/product", {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify(productFormData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to add product");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to add product",
                    variant: "destructive",
                });
                return false;
            }

            router.push("/product");
            setIsLoading(false);
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

    const editProduct = async (productFormData: ProductFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/product/${productFormData.id}`, {
                method: "PATCH",
                headers: authHeader(),
                body: JSON.stringify(productFormData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to add product");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to add product",
                    variant: "destructive",
                });
                return false;
            }

            router.push("/product");
            setIsLoading(false);
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

    const getAllProduct = async ({currentPage, pageSize}: { currentPage: number, pageSize: number }) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/product?page=${currentPage}&pageSize=${pageSize}`)

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to fetch product");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to fetch product",
                    variant: "destructive",
                });
                return undefined;
            }

            setIsLoading(false);

            return result as ApiResponse<Product[]> & { data: any[], pagination: any };
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            toast({
                title: "Error",
                description: `${err}`,
                variant: "destructive",
            });

            return undefined;
        }
    }

    const getAllProductByOwner = async ({currentPage, pageSize}: { currentPage: number, pageSize: number }) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/product/owner?page=${currentPage}&pageSize=${pageSize}`, {
                headers: authHeader(),
            })

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to fetch product");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to fetch product",
                    variant: "destructive",
                });
                return undefined;
            }

            setIsLoading(false);

            return result as ApiResponse<Product[]> & { data: any[], pagination: any };
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            toast({
                title: "Error",
                description: `${err}`,
                variant: "destructive",
            });

            return undefined;
        }
    }

    const deleteProduct = async (productId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/product/${productId}`, {
                method: "DELETE",
                headers: authHeader(),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to delete product");
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete product",
                    variant: "destructive",
                });
                return false;
            }

            setIsLoading(false);
            toast({
                title: "Success",
                description: "Product deleted successfully",
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

    return {addProduct, editProduct, getAllProduct, getAllProductByOwner, deleteProduct, error, isLoading};
}