import { NextResponse } from 'next/server';

let mockProfile = {
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
    skills: [
        { name: 'React', level: 5 },
        { name: 'JavaScript', level: 5 },
        { name: 'CSS', level: 4 }
    ],
    resume_url: 'https://example.com/resume.pdf',
    location: 'New York, USA',
    preferred_job_categories: ['IT', 'Software Engineering']
};

export async function GET() {
    return NextResponse.json(mockProfile);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        mockProfile = { ...mockProfile, ...body };
        return NextResponse.json(mockProfile);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
