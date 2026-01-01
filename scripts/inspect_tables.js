const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
    console.log(`Inspecting columns for table: ${tableName}`);
    
    // We can't use information_schema directly via PostgREST usually.
    // But we can try to fetch one row and see the keys.
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
    } else if (data && data.length > 0) {
        console.log(`Columns in ${tableName}:`, Object.keys(data[0]));
    } else {
        console.log(`Table ${tableName} is empty, could not infer columns.`);
    }
}

async function run() {
    await inspectTable('job_posts');
    await inspectTable('profiles');
}

run();
