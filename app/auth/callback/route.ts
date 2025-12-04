import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error.message)
            return NextResponse.redirect(new URL('/login?error=verification_failed', requestUrl.origin))
        }
    }

    // Redirect to dashboard after successful verification
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
