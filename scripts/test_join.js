const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testJoin() {
    console.log("Testing nested join: mediator_matches -> job_posts -> profiles");

    const { data, error } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            job_posts (
                title,
                profiles (company_name)
            )
        `)
        .limit(1);

    if (error) {
        console.error("Join failed with error:", error);
    } else {
        console.log("Join successful!");
        console.log("Data sample:", JSON.stringify(data[0], null, 2));
    }

    console.log("\nTesting explicit join: profiles:company_id(company_name)");
    const { data: data2, error: error2 } = await supabase
        .from('mediator_matches')
        .select(`
            id,
            status,
            job_posts (
                title,
                profiles:company_id (company_name)
            )
        `)
        .limit(1);

    if (error2) {
        console.error("Explicit join failed with error:", error2);
    } else {
        console.log("Explicit join successful!");
        console.log("Data sample:", JSON.stringify(data2[0], null, 2));
    }
}

testJoin();
