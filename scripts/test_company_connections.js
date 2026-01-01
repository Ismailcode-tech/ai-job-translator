const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
    const companyUserId = 'ce0abbd7-f5b6-42ef-a57c-c1c645a5f9dd'; // Recruiter
    console.log(`Testing company connections query for user ${companyUserId}...`);

    const { data: connections, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            created_at,
            candidate:profiles (
                id,
                name,
                email,
                phone,
                location,
                bio,
                preferred_job_categories
            ),
            job_posts (
                id,
                title,
                company_id
            )
        `)
        .eq('status', 'active')
        .eq('job_posts.company_id', companyUserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Query failed:", error);
    } else {
        console.log("Found", connections?.length, "connections");
        if (connections && connections.length > 0) {
            console.log("First connection:", JSON.stringify(connections[0], null, 2));
        }
    }
}

testQuery();
