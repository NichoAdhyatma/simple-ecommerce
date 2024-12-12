import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { withAuth } from '@/lib/middleware/verify-jwt-token';

export const POST = withAuth(async (request: NextRequest) => {
    try {
        console.log(request.headers)
        // Ambil file dari form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Validasi file
        if (!file) {
            return NextResponse.json(
                { message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validasi tipe file
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed' },
                { status: 400 }
            );
        }

        // Validasi ukuran file (misalnya maks 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: 'File too large. Max size is 5MB' },
                { status: 400 }
            );
        }

        // Generate nama file unik
        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const randomString = Math.random().toString(36).substring(2, 7);
        const newFilename = `${timestamp}-${randomString}${ext}`;

        // Tentukan path penyimpanan
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, newFilename);

        // Baca byte file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Simpan file
        await writeFile(filePath, buffer);

        // Kembalikan response berhasil
        return NextResponse.json({
            message: 'File uploaded successfully',
            filename: newFilename,
            path: `/uploads/${newFilename}`
        }, { status: 200 });

    } catch (error: any) {
        console.error('Upload error:', error);

        return NextResponse.json(
            {
                message: `${error}`,
                error: `${error}`
            },
            { status: 500 }
        );
    }
});