import {NextRequest, NextResponse} from "next/server";
import {ProductFormData} from "@/lib/zod-schema/product";
import prisma from "@/lib/prisma";
import {withAuth} from "@/lib/middleware/verify-jwt-token";

export type ParamsProps = {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: NextRequest, props: ParamsProps) {
    try {
        const params = await props.params
        const product = await prisma.product.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                owner: true,
                name: true,
                description: true,
                price: true,
                userId: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                imagePath: true
            }
        })

        if (!product) {
            return NextResponse.json({message: 'Product not found'}, {status: 404});
        }

        return NextResponse.json({message: 'Success fetching data', data: product});
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong.', error}, {status: 500});
    }
}

export const PATCH = withAuth(async (request: NextRequest, {params}: { params: { id: string } }) => {
    const {name, description, price, imagePath, category} = await request.json() as ProductFormData;

    try {
        const product = await prisma.product.update(
            {
                where: {
                    id: params.id
                },
                data: {
                    name,
                    description,
                    price,
                    imagePath,
                    category
                }
            })

        return NextResponse.json({message: 'Success Updated Data', data: product});
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong.', error}, {status: 500});
    }
})

export async function DELETE(request: NextRequest, props: ParamsProps) {

    try {
        const params = await props.params
        const product = await prisma.product.delete(
            {
                where: {
                    id: params.id
                },
            })

        return NextResponse.json({message: 'Success Deleted Product!', data: product});
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong.', error}, {status: 500});
    }
}