'use server'

import {ProductForm} from '@/components/product/product-form'
import {Button} from "@/components/ui/button";
import {ProductFormData} from "@/lib/zod-schema/product";
import ProductNotFound from "@/components/product/product-not-found";

const getProduct = async (id: string) => {
    const response = await fetch(`${process.env.API_URL}/api/product/${id}`, {
        method: 'GET',
    })

    if (response.ok) {
        return (await response.json()).data as ProductFormData;
    }
}

export default async function page({params, searchParams}: {
    params: Promise<{ action: string }>,
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
},) {
    const isEditing = (await params).action === 'edit';

    const product = await getProduct((await  searchParams)?.id as string);

    if (!product && isEditing) {
        return <ProductNotFound/>
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <ProductForm initialData={product}/>
        </div>
    )
}

