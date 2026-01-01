const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Try loading .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log('.env.local not found at', envPath);
}

async function run() {
    console.log('Checking Environment...');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
    // Don't print the key, just check layout
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? `Present (${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 5)}...)` : 'Missing');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('CRITICAL: Missing Supabase keys!');
        return;
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('\nChecking Database...');
    const { count: jobCount, error: jobError } = await supabase.from('job_posts').select('*', { count: 'exact', head: true });
    if (jobError) console.error('Error fetching jobs:', jobError);
    else console.log('Job Posts:', jobCount);

    const { count: candidateCount, error: candError } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'individual');
    if (candError) console.error('Error fetching candidates:', candError);
    else console.log('Individual Candidates:', candidateCount);

    // Fetch Candidates details
    const { data: candidates } = await supabase.from('profiles').select('id, skills, user_type').eq('user_type', 'individual');
    console.log('\n--- Candidates ---');
    if (candidates) {
        candidates.forEach(c => {
            console.log(`- Candidate ${c.id.slice(0, 4)}... Skills: ${JSON.stringify(c.skills)}`);
        });
    }

    // Fetch latest job
    const { data: latestJob, error: latestJobError } = await supabase.from('job_posts').select('*').order('created_at', { ascending: false }).limit(1).single();
    if (latestJob) {
        console.log(`\n--- Latest Job: ${latestJob.title} (${latestJob.id}) ---`);
        console.log(`Description Snippet: ${latestJob.description?.slice(0, 50)}...`);

        // Check matches for this job
        const { data: matches } = await supabase
            .from('mediator_matches')
            .select(`
                id,
                ai_score,
                status,
                job:job_posts!inner(title, company_id)
            `)
            .eq('job_id', latestJob.id);

        console.log(`Matches Found: ${matches?.length || 0}`);
        if (matches) {
            matches.forEach(m => {
                console.log(`  > Match ${m.id.slice(0, 4)}... Score: ${m.ai_score}% Status: ${m.status} JobCompany: ${m.job.company_id}`);
            });
        }
    } else {
        console.log('No jobs found.');
    }
}

run();
