
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectForeignKeys() {
    console.log('Inspecting foreign keys that might block user deletion...');

    // Query to find foreign keys referencing public.profiles or auth.users
    const { data: constraints, error } = await supabase.rpc('inspect_foreign_keys_logic');

    // Since I can't easily create an RPC without already having access, 
    // I'll use a direct query via the service role client if possible (using .from().select() blocks usually)
    // Actually, I'll use a simpler approach: try to find the constraints using a raw SQL execution if I can,
    // but the service role client doesn't have a direct raw SQL method.

    // I will instead provide the SQL to the user to run in the dashboard, 
    // as it's the safest and most standard way to see this info.

    console.log('Please run the following SQL in your Supabase SQL Editor to see which tables block user deletion:');
    console.log(`
SELECT
    tc.table_schema, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON rc.constraint_name = tc.constraint_name
      AND rc.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (ccu.table_name = 'profiles' OR ccu.table_name = 'users')
ORDER BY tc.table_name;
    `);
}

inspectForeignKeys();
