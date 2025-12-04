```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const cookieStore = await cookies()
        const supabase = await createClient(cookieStore)
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
            console.error('Auth callback error:', error.message)
            return NextResponse.redirect(new URL('/login?error=verification_failed', requestUrl.origin))
        }

        // Session is now established, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }

    // No code provided, redirect to login
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
```
