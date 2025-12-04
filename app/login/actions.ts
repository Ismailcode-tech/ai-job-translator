'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    try {
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
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        return { error: getUserFriendlyError(error.message || 'An unexpected error occurred') }
    }
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
    try {
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
                // IMPORTANT: This tells Supabase we want to handle the code manually if configured,
                // but mostly it just registers the user.
                // If "Confirm email" is on, Supabase sends the email automatically.
            },
        })

        if (error) {
            return { error: getUserFriendlyError(error.message) }
        }

        // Redirect to verification page instead of dashboard
        redirect(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        return { error: getUserFriendlyError(error.message || 'An unexpected error occurred') }
    }
}

export async function verifyEmail(email: string, code: string) {
    try {
        const supabase = await createClient()
        const trimmedEmail = email.trim().toLowerCase()
        const trimmedCode = code.trim()

        console.log(`Attempting verification for ${trimmedEmail} with code ${trimmedCode}`)

        // 1. Try 'signup'
        let { error: signupError } = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token: trimmedCode,
            type: 'signup'
        })

        if (!signupError) return { success: true }

        console.log(`Signup verification failed: ${signupError.message}`)

        // 2. Try 'email' (magic link / change email flow)
        let { error: emailError } = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token: trimmedCode,
            type: 'email'
        })

        if (!emailError) return { success: true }

        console.log(`Email verification failed: ${emailError.message}`)

        // 3. Try 'recovery' (just in case)
        let { error: recoveryError } = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token: trimmedCode,
            type: 'recovery'
        })

        if (!recoveryError) return { success: true }

        console.log(`Recovery verification failed: ${recoveryError.message}`)

        // Return a detailed error message for debugging
        return { error: `Failed: ${signupError?.message} (Signup), ${emailError?.message} (Email)` }
    } catch (error: any) {
        return { error: error.message || 'Verification failed' }
    }
}

export async function resendVerificationEmail(email: string) {
    try {
        const supabase = await createClient()
        const trimmedEmail = email.trim().toLowerCase()

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: trimmedEmail,
        })

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Failed to resend code' }
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
