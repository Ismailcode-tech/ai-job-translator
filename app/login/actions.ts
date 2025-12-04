'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

// Helper function to make error messages user-friendly
function getUserFriendlyError(errorMessage: string): string {
    if (errorMessage.includes('Invalid API key') || errorMessage.includes('API')) {
        return 'Please fill in all fields correctly'
    }
    if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        return 'This email is already registered. Try logging in instead.'
    }
    if (errorMessage.includes('Invalid email')) {
        return 'Please enter a valid email address'
    }
    if (errorMessage.includes('Password')) {
        return 'Password must be at least 6 characters long'
    }
    // Return the original message if we don't have a better one
    return errorMessage
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        return { error: getUserFriendlyError(error.message) }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
