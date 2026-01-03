
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectSchema() {
    console.log('Inspecting job_posts schema...');

    // We can't query information_schema directly with supabase-js easily unless we use RPC or raw SQL.
    // Instead, I'll try to insert a dummy record and catch the error, WHICH WILL TELL ME if a column is missing.
    // BUT, inserting might fail due to FKs.

    // Better: Select * from job_posts limit 0 and look at the error? No, that just gives empty data.

    // I will try to run a raw query via a specific "rpc" if available, or just guess.
    // Actually, I can use the trick of selecting a column I verify.

    // Let's rely on the error message the user provided earlier: "Failed to create opportunity".
    // I need to see the REAL error.

    // I'll create a script that tries to insert a row using the SERVICE ROLE KEY (bypassing RLS)
    // If THIS fails, it's a schema issue (missing column).
    // If THIS succeeds, it's an RLS issue.

    const { data, error } = await supabase.from('job_posts').insert({
        company_id: '00000000-0000-0000-0000-000000000000', // invalid ID will fail FK
        // But wait, if I use an invalid ID, it fails FK first.

        // I'll just check if the columns exist by selecting them.
        title: 'Test',
        original_text: 'Test'
    }).select().limit(1);

    if (error) {
        console.log('Insert Attempt Error:', error);
    } else {
        console.log('Insert succeeded (unexpectedly?)');
    }

}

inspectSchema();
