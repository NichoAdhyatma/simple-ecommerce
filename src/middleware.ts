import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY || 'secret');  // Use TextEncoder to convert the key

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const protectedPaths = [
        '/product',
        '/profile',
    ];

    const isPathProtected = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isPathProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth', req.url));
        }

        try {
            // Verify the token using 'jose'
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            console.error('Error verifying token:', error);
            return NextResponse.redirect(new URL('/auth', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Daftar rute yang ingin di-middleware
        '/product/:path*',
        '/profile/:path*',
    ],
}
