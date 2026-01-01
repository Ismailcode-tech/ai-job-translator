const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log("Checking all matches...");

    const { data: matches, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            user_id,
            job_id,
            job_posts (
                title,
                company_id
            )
        `);

    if (error) {
        console.error("Error fetching matches:", error);
        return;
    }

    console.log(`Found ${matches.length} total matches.`);

    if (matches.length > 0) {
        for (const match of matches) {
            console.log(`Match ID: ${match.id} | Status: ${match.status}`);
            console.log(`- Candidate ID: ${match.user_id}`);
            console.log(`- Job Title: ${match.job_posts?.title}`);
            console.log(`- Company ID: ${match.job_posts?.company_id}`);
        }
    }
}

diagnose();
