const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function transferJob() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const jobId = 'c8429c34-7a14-4643-9deb-08420353d8b7'; // From previous script output
    // The previous debug screen showed this ID for the CURRENT user:
    const newOwnerId = 'ce0abbd7-f5b6-42ef-a57c-c1c645a5f9dd';

    console.log(`Transferring Job ${jobId} to User ${newOwnerId}...`);

    const { data, error } = await supabase
        .from('job_posts')
        .update({ company_id: newOwnerId })
        .eq('id', jobId)
        .select();

    if (error) {
        console.error('Transfer failed:', error);
    } else {
        console.log('Transfer successful!', data);
    }
}

transferJob();
