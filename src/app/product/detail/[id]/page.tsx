import { ProductDetail } from '@/components/product/product-detail'
import ProductNotFound from '@/components/product/product-not-found'
import {ParamsProps} from "@/app/api/product/[id]/route";

const getProduct = async (id: string) => {
    const response = await fetch(`${process.env.API_URL}/api/product/${id}`, {
        method: 'GET',
    })

    if (response.ok) {
        return (await response.json()).data;
    }
}

export default async function ProductPage(props:ParamsProps) {
    const params = await props.params
    const product = await getProduct(params.id);

    if (!product) {
        return <ProductNotFound />
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <ProductDetail product={product} />
        </div>
    )
}
