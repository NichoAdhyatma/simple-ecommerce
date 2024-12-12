import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export function withAuth(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (req: NextRequest, context?: any) => {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
        }

        console.log(authHeader)

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as { id: string, email: string };

            context = context || {};
            context.user = { id: decoded.id, email: decoded.email };

            // if (context.params && context.params.id !== decoded.id) {
            //     return NextResponse.json({
            //         message: 'Unauthorized: Access to other user\'s data is forbidden'
            //     }, { status: 403 }); // Gunakan status 403 Forbidden
            // }

            return await handler(req, context);
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
    };
}