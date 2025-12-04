import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // In the browser, process.env doesn't exist - we need to use NEXT_PUBLIC_ vars differently
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    console.log('Creating Supabase browser client with:', { supabaseUrl, keyLength: supabaseKey.length })

    return createBrowserClient(supabaseUrl, supabaseKey)
}
