const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectMatches() {
    console.log("Inspecting 'mediator_matches' columns...");
    const { data: matches, error } = await supabase
        .from('mediator_matches')
        .select('*')
        .limit(1);

    if (error) console.error(error);
    else console.log("mediator_matches columns:", Object.keys(matches[0] || {}));
}

inspectMatches();
