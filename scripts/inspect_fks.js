const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectFKs() {
    console.log("Inspecting foreign keys for 'job_posts'...");

    const { data, error } = await supabase.rpc('get_table_fks', { table_name: 'job_posts' });

    if (error) {
        console.log("RPC 'get_table_fks' failed (expected if not defined). Trying raw query...");
        // Fallback: Use a generic query if possible, but usually rpc is needed for sys tables via API.
        // Or we can try to join and see the error details again.
    } else {
        console.log("Foreign Keys:", JSON.stringify(data, null, 2));
    }

    // Alternative: Try to fetch a job post and check its company_id value
    const { data: job } = await supabase.from('job_posts').select('id, company_id').limit(1).single();
    if (job) {
        console.log(`Job ID: ${job.id}, Company ID: ${job.company_id}`);
        const { data: profile } = await supabase.from('profiles').select('id, company_name').eq('id', job.company_id).single();
        console.log(`Linked Profile:`, profile);
    }
}

inspectFKs();
