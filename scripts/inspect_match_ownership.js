const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function inspectOwnership() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const matchId = '03494dc8-e5de-413c-87f2-0a3b23962e47'; // From screenshot

    console.log(`Inspecting Match: ${matchId}`);

    // 1. Fetch Match + Job + Company ID
    const { data: match, error } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            job:job_posts(id, title, company_id)
        `)
        .eq('id', matchId)
        .single();

    if (error) {
        console.error('Error fetching match:', error);
        return;
    }

    console.log('Match Found:', {
        id: match.id,
        status: match.status,
        job_id: match.job_id,
        job_title: match.job?.title,
        job_owner_id: match.job?.company_id
    });

    const companyId = match.job?.company_id;

    // 2. Fetch Profile for that Company ID
    if (companyId) {
        const { data: companyProfile } = await supabase
            .from('profiles')
            .select('id, name, email, role, user_type')
            .eq('id', companyId)
            .single();

        console.log('Job Owner Profile:', companyProfile);
    } else {
        console.log('Job has NO company_id!');
    }
}

inspectOwnership();
