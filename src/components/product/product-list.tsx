'use client'

import { useState, useEffect } from 'react'
import useProduct from '@/hooks/use-product'
import { ProductCard } from '@/components/product/product-card'
import { PaginationControls } from '@/components/product/product-pagination-control'
import { Skeleton } from '@/components/ui/skeleton'
import {Button} from "@/components/ui/button";

export function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1
    })

    const { getAllProduct, error, isLoading } = useProduct()

    useEffect(() => {
        fetchProducts()
    }, [pagination.page])

    const fetchProducts = async () => {
        const result = await getAllProduct({ currentPage: pagination.page, pageSize: pagination.pageSize })

        if (result && result.data && result.pagination) {
            setProducts(result.data)
            setPagination(result.pagination)
        }
    }

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    if (error) {
        return <div className="text-center text-red-500">{error} <Button>Reload Page</Button></div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: pagination.pageSize }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                    : products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>
            <div className="mt-8">
                <PaginationControls
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

function ProductCardSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}

