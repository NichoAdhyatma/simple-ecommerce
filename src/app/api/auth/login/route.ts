import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required.' }, {status: 400});
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials.'}, {status: 401});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials.'}, {status: 401});
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: '24h', // 24 jam expire token
        });

        return NextResponse.json({ message: 'Login successful.', data: token });
    } catch (error) {
        return NextResponse.json({ message: `Something went wrong. ${error}`, error }, {status: 500});
    }
}
