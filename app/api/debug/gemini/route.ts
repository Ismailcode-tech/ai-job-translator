import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    try {
        // Use raw fetch to bypass SDK potential issues and get raw list
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json({
            key_configured: true,
            key_length: apiKey.length,
            key_start: apiKey.substring(0, 5),
            models: data
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch models',
            details: error.message
        }, { status: 500 });
    }
}
