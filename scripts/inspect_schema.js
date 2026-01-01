const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log("Inspecting 'job_posts' columns...");
    const { data: jobPosts, error: jobError } = await supabase
        .from('job_posts')
        .select('*')
        .limit(1);

    if (jobError) console.error(jobError);
    else console.log("job_posts columns:", Object.keys(jobPosts[0] || {}));

    console.log("\nInspecting 'profiles' columns...");
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError) console.error(profileError);
    else console.log("profiles columns:", Object.keys(profiles[0] || {}));
}

inspectSchema();
