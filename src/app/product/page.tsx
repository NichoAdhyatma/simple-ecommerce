'use client'

import {useState, useEffect} from 'react'
import useProduct from '@/hooks/use-product'
import {Button} from '@/components/ui/button'
import {PaginationControls} from '@/components/product/product-pagination-control'
import {Skeleton} from '@/components/ui/skeleton'
import Link from 'next/link'
import {Edit, Trash2} from 'lucide-react'
import {useRouter} from "next/navigation";

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1
    });

    const router = useRouter();

    const {getAllProductByOwner, deleteProduct, error, isLoading} = useProduct()

    useEffect(() => {
        fetchProducts()
    }, [pagination.page])

    const fetchProducts = async () => {
        const result = await getAllProductByOwner({currentPage: pagination.page, pageSize: pagination.pageSize})
        if (result && result.data && result.pagination) {
            setProducts(result.data)
            setPagination(result.pagination)
        }
    }

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({...prev, page: newPage}))
    }

    if (error) {
        return <div className="text-center text-red-500">{error} <Button>Reload Page</Button></div>
    }

    async function handleDelete(id: string) {
        await deleteProduct(id)
        await fetchProducts();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => router.back()} variant={'neutral'}>Back</Button>
                <h1 className="text-3xl font-bold">Your Products</h1>
                <Link href="/product/add">
                    <Button>Create New Product</Button>
                </Link>
            </div>
            {isLoading ? (
                <ProductTableSkeleton/>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Category</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b">
                                <td className="p-2">{product.name}</td>
                                <td className="p-2">{product.description}</td>
                                <td className="p-2">${(product.price / 100).toFixed(2)}</td>
                                <td className="p-2">{product.category}</td>
                                <td className="p-2">
                                    <div className="flex space-x-2">
                                        <Link href={`/product/edit?id=${product.id}`}>
                                            <Button size="sm" variant="neutral">
                                                <Edit className="h-4 w-4 mr-1"/> Edit
                                            </Button>
                                        </Link>
                                        <Button size="sm" className={'bg-red-300'} onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4 mr-1"/> Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
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

function ProductTableSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({length: 5}).map((_, index) => (
                <div key={index} className="flex space-x-4">
                    <Skeleton className="h-6 w-1/4"/>
                    <Skeleton className="h-6 w-1/4"/>
                    <Skeleton className="h-6 w-1/6"/>
                    <Skeleton className="h-6 w-1/6"/>
                    <Skeleton className="h-6 w-1/6"/>
                </div>
            ))}
        </div>
    )
}

