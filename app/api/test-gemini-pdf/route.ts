import { NextResponse } from 'next/server';
import { extractSkillsFromPDF } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        console.log('=== TEST ENDPOINT: Starting Gemini PDF test ===');

        const formData = await request.formData();
        const file = formData.get('pdf') as File;

        if (!file) {
            return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
        }

        console.log('Test file received:', file.name, file.size, file.type);

        const arrayBuffer = await file.arrayBuffer();
        console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);

        const result = await extractSkillsFromPDF(arrayBuffer);
        console.log('Extraction result:', JSON.stringify(result));

        return NextResponse.json({
            success: true,
            result,
            fileInfo: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        });
    } catch (error: any) {
        console.error('=== TEST ENDPOINT: Error ===', error);
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
