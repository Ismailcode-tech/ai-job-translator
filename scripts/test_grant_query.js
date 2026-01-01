const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
    const matchId = '03494dc8-e5de-413c-87f2-0a3b23962e47';
    console.log(`Testing query for match ${matchId}...`);

    const { data, error } = await supabase
        .from('mediator_matches')
        .select('*, job_posts(company_id)')
        .eq('id', matchId)
        .single();

    if (error) {
        console.error("Query failed:", error);
    } else {
        console.log("Query success!");
        console.log("Data:", JSON.stringify(data, null, 2));
    }
}

testQuery();
