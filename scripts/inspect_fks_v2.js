const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectFKs() {
    console.log("Inspecting foreign keys for 'job_posts'...");

    // Query system tables to find foreign keys
    const { data: fks, error } = await supabase.rpc('get_foreign_keys_for_table', { table_name: 'job_posts' });

    // If RPC is not available, we can try to guess or use a raw query if enabled (unlikely)
    // Or we can just look at what 'job_posts' definition might be by checking previous migration instructions
    // But let's try a simple join on 'profiles' without 'company_id' and see if it suggests anything

    const { error: joinError } = await supabase
        .from('job_posts')
        .select('profiles(*)')
        .limit(1);

    if (joinError) {
        console.log("Join Hint:", joinError);
    }

    // Also check if 'company_id' is actually a UUID
    const { data: job } = await supabase.from('job_posts').select('company_id').limit(1).single();
    if (job) {
        console.log("Sample company_id:", job.company_id);
    }
}

inspectFKs();
