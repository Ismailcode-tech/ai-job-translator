'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MediatorService } from '@/lib/mediator/service';

export async function createOpportunity(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const salary_range = formData.get('salary_range') as string;

    const { data, error } = await supabase
        .from('job_posts')
        .insert({
            company_id: user.id,
            title,
            description,
            original_text: description,
            location,
            employment_type: type,
            salary_range,
            source: 'manual',
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('Create Opportunity Error:', error);
        return { error: error.message };
    }

    try {
        await MediatorService.matchJobToCandidates(data.id);
    } catch (matchError) {
        console.error('Auto-match failed:', matchError);
    }

    revalidatePath('/dashboard/company/opportunities');
    redirect('/dashboard/company/opportunities');
}

export async function deleteJob(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const jobId = formData.get('id') as string;

    const { error } = await supabase
        .from('job_posts')
        .delete()
        .eq('id', jobId)
        .eq('company_id', user.id);

    if (error) {
        console.error('Delete Job Error:', error);
        throw new Error('Failed to delete job');
    }

    revalidatePath('/dashboard/company/opportunities');
}

export async function duplicateJob(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const jobId = formData.get('id') as string;

    // Fetch original job
    const { data: original, error: fetchError } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', jobId)
        .single();

    if (fetchError || !original) {
        throw new Error('Job not found');
    }

    // Insert copy
    const { error } = await supabase
        .from('job_posts')
        .insert({
            ...original,
            id: undefined, // Let DB generate new ID
            company_id: user.id,
            title: `${original.title} (Copy)`,
            created_at: undefined, // Let DB generate timestamp
            mediator_matches: undefined // Don't copy matches? Or should we? Default to no matches for new job.
        });

    if (error) {
        console.error('Duplicate Job Error:', error);
        throw new Error('Failed to duplicate job');
    }

    revalidatePath('/dashboard/company/opportunities');
}

export async function updateJob(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const salary_range = formData.get('salary_range') as string;

    const { error } = await supabase
        .from('job_posts')
        .update({
            title,
            description,
            original_text: description,
            location,
            employment_type: type,
            salary_range,
        })
        .eq('id', id)
        .eq('company_id', user.id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/company/opportunities');
    redirect('/dashboard/company/opportunities');
}
