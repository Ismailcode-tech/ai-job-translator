
const { createClient } = require('@supabase/supabase-js');
const { MediatorService } = require('../lib/mediator/service'); // Adjust path if needed for JS execution, but this is TS compiled code mostly.
// Actually, running TS files directly is hard without ts-node. 
// I will create a JS script that uses ONLY Supabase and HTTP calls to the debug endpoint if possible, 
// OR I will ask the user to hit the debug endpoint I saw earlier: /api/debug-match

// Since I saw /api/debug-match exists, the best way is to ask the user to use it.
// I will create a script that they can run via 'node' that calls their own production URL.

const url = 'https://ai-job-translator.vercel.app/api/debug-match'; // Or localhost if they are local
// Wait, the user is on Vercel.

// Let's create a Client-Side script they can run in their browser console OR a curl command.
// Actually, a simple manual verification is best.

// I will create a script to check if the job exists and has candidates.
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing keys');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkData() {
    console.log('Checking recent data...');

    // 1. Get recent job
    const { data: jobs } = await supabase.from('job_posts').select('*').order('created_at', { ascending: false }).limit(1);
    const job = jobs[0];
    if (!job) {
        console.log('No jobs found.');
        return;
    }
    console.log(`Latest Job: ${job.title} (ID: ${job.id})`);

    // 2. Get candidates
    const { data: candidates } = await supabase.from('profiles').select('*').eq('user_type', 'individual');
    console.log(`Found ${candidates.length} candidates.`);

    // 3. Check matches
    const { data: matches } = await supabase.from('mediator_matches').select('*').eq('job_id', job.id);
    console.log(`Found ${matches.length} matches for this job.`);
}

checkData();
