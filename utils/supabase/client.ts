import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjpqsmuixmepapjtovtz.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHFzbXVpeG1lcGFwanRvdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzQ0MjcsImV4cCI6MjA4MDI1MDQyN30.MS7NCAUMDDiZO5vKCjsyjD3v2iS4Lve5i6YjgWyKyjA'
    )
}
