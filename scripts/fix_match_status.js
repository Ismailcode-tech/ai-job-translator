const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStatus() {
    const matchId = '03494dc8-e5de-413c-87f2-0a3b23962e47'; // Senior Frontend Match

    console.log(`Updating Match ${matchId} to 'consented'...`);

    const { data, error } = await supabase
        .from('mediator_matches')
        .update({ status: 'consented' })
        .eq('id', matchId)
        .select();

    if (error) {
        console.error("Update failed:", error);
    } else {
        console.log("Update successful!", data);
    }
}

fixStatus();
