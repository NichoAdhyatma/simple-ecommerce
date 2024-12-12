import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {

    const {name, email, password, phoneNumber} = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({message: 'All fields are required.'}, {status: 400},);
    }

    try {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json({message: 'Email already in use.'}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phoneNumber,
                password: hashedPassword,
            },
        });

        return NextResponse.json({message: 'User registered successfully', data: user}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong.', error}, {status: 500});
    }
}
