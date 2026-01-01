const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testQuery() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    console.log('Testing Match Detail Query...');

    // 1. Get a valid match ID first
    const { data: matches } = await supabase.from('mediator_matches').select('id, job_id, job:job_posts(company_id)').limit(1);

    if (!matches || matches.length === 0) {
        console.log('No matches found in DB to test with.');
        return;
    }

    const testMatch = matches[0];
    console.log(`Testing with Match ID: ${testMatch.id}`);
    console.log(`Expected Company ID: ${testMatch.job.company_id}`);

    // 2. Run the EXACT query from the page
    // Note: In the page we use the USER's auth client. Here we use Service Role but we will manually filter to simulate.
    // The page query:
    /*
            .select(`
                *,
                candidate:profiles(id, experience_years, bio, skills, location, employment_type), 
                job:job_posts!inner(title, company_id)
            `)
            .eq('id', (await params).id)
            .eq('job.company_id', user.id) // check syntax
            .single(),
    */

    const { data, error } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            candidate:profiles(id, experience_years, bio, skills, location), 
            job:job_posts!inner(title, company_id)
        `)
        .eq('id', testMatch.id)
        .eq('job.company_id', testMatch.job.company_id)
        .single();

    if (error) {
        console.error('Query Failed:', error);
    } else {
        console.log('Query Success!');
        console.log('Data:', data ? 'Found' : 'Null');
    }
}

testQuery();
