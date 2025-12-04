import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    try {
        const cookieStore = await cookies()
        const supabase = await createClient()

        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error.message)
            return NextResponse.redirect(new URL('/login?error=verification_failed', requestUrl.origin))
        }

        // Create response with redirect
        const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))

        // Ensure cookies are set properly
        if (data.session) {
            // The session cookies should be automatically set by the Supabase client
            // But we'll explicitly set them to ensure they persist
            response.cookies.set('sb-access-token', data.session.access_token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })

            response.cookies.set('sb-refresh-token', data.session.refresh_token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
        }

        return response
    } catch (err: any) {
        console.error('Unexpected error in auth callback:', err.message)
        return NextResponse.redirect(new URL('/login?error=unexpected', requestUrl.origin))
    }
}
