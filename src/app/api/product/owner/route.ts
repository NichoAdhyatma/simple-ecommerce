import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {withAuth} from "@/lib/middleware/verify-jwt-token";

export const GET = withAuth(async (request: NextRequest, {user}: { user: { id: string } }) => {
    try {
        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        const offset = (page - 1) * pageSize;

        const products = await prisma.product.findMany({
            where: {
                userId: user.id,
            },
            skip: offset,
            take: pageSize,
        });

        const totalCount = await prisma.product.count();

        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            message: 'Success fetching data',
            data: products,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages,
            },
        });
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong.', error}, {status: 500});
    }
})