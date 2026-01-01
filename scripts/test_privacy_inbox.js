const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPrivacyInboxQuery() {
    const userId = 'ce0abbd7-f5b6-42ef-a57c-c1c645a5f9dd'; // Candidate ID for the consented match

    console.log(`Querying Privacy Inbox for user ${userId}...`);

    const { data: requests, error } = await supabase
        .from('mediator_matches')
        .select(`
            *,
            job_posts (
                title,
                profiles (company_name)
            )
        `)
        .eq('user_id', userId)
        .eq('status', 'consented');

    if (error) {
        console.error("Query failed:", error);
    } else {
        console.log(`Query successful! Found ${requests.length} requests.`);
        if (requests.length > 0) {
            console.log("Sample Match Details:");
            console.log(`- Match ID: ${requests[0].id}`);
            console.log(`- Job Title: ${requests[0].job_posts?.title}`);
            console.log(`- Company Name: ${requests[0].job_posts?.profiles?.company_name}`);
        }
    }
}

testPrivacyInboxQuery();
