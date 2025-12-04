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
        return { error: getUserFriendlyError(error.message) }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

// Helper function to make error messages user-friendly
function getUserFriendlyError(errorMessage: string): string {
    const lowerCaseError = errorMessage.toLowerCase()
    if (lowerCaseError.includes('invalid api key') || lowerCaseError.includes('api key') || lowerCaseError.includes('apikey')) {
        return 'Configuration error: Please contact support.'
    }
    if (lowerCaseError.includes('already registered') || lowerCaseError.includes('already exists')) {
        return 'This email is already registered. Try logging in instead.'
    }
    if (lowerCaseError.includes('invalid email')) {
        return 'Please enter a valid email address'
    }
    if (lowerCaseError.includes('password')) {
        return 'Password must be at least 6 characters long'
    }
    if (lowerCaseError.includes('invalid login credentials')) {
        return 'Invalid email or password'
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
