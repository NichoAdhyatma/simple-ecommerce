import {withAuth} from "@/lib/middleware/verify-jwt-token";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export const GET = withAuth(async (req: NextRequest, {user}: {
    user: { id: string },
}) => {
    try {
        console.log('user', user);
        console.log(req.headers.get('Authorization'));
        const prismaUser = await prisma.user.findUnique({
            where: {id: user.id},
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                photo: true
            }
        });

        if (!prismaUser) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            );
        }

        return NextResponse.json({
            message: "Success fetching data",
            data: prismaUser,
        });
    } catch (error: any) {
        console.error("Error fetching user:", error);

        return NextResponse.json(
            {
                message: "Something went wrong.",
                error: error.message || "Unknown error",
            },
            {status: 500}
        );
    }
});

export const PATCH = withAuth(async (req: NextRequest, {user}: { user: { id: string } }) => {
    try {
        const {name, phoneNumber, photo} = await req.json();

        const prismaUser = await prisma.user.update({
            where: {id: user.id},
            data: {
                name,
                phoneNumber,
                photo,
            }
        });

        return NextResponse.json({
            message: "Success updating data",
            data: prismaUser,
        });
    } catch (error: any) {
        console.error("Error updating user:", error);

        return NextResponse.json(
            {
                message: "Something went wrong.",
                error: error.message || "Unknown error",
            },
            {status: 500}
        );
    }
})