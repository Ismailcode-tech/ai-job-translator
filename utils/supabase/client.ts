import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // In the browser, process.env doesn't exist - we need to use NEXT_PUBLIC_ vars differently
    const supabaseUrl = 'https://jjpqsmuixmepapjtovtz.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHFzbXVpeG1lcGFwanRvdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzQ0MjcsImV4cCI6MjA4MDI1MDQyN30.MS7NCAUMDDiZO5vKCjsyjD3v2iS4Lve5i6YjgWyKyjA'

    console.log('Creating Supabase browser client with:', { supabaseUrl, keyLength: supabaseKey.length })

    return createBrowserClient(supabaseUrl, supabaseKey)
}
