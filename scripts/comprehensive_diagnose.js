const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log("--- DIANOSTIC START ---");

    // 1. Check all matches
    const { data: matches, error: matchError } = await supabase
        .from('mediator_matches')
        .select('*, job_posts(title, company_id)');

    if (matchError) {
        console.error("Error fetching matches:", matchError);
    } else {
        console.log(`Found ${matches.length} total matches.`);
        matches.forEach(m => {
            console.log(`Match ID: ${m.id} | Status: ${m.status} | Job: ${m.job_posts?.title} | Candidate: ${m.user_id}`);
        });
    }

    // 2. Check for "consented" matches specifically
    const consented = matches?.filter(m => m.status === 'consented') || [];
    console.log(`Matches with 'consented' status: ${consented.length}`);

    // 3. Check for specific candidate matches if any candidate is provided (mocking logic)
    // Let's look for any match that stayed in 'suggested' despite being clicked.
    // We can't know which ones were clicked, but we can see if there are MANY 'suggested' ones.

    // 4. Inspect Audit Logs for 'request_contact'
    const { data: logs, error: logError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'request_contact')
        .order('created_at', { ascending: false });

    if (logError) {
        console.error("Error fetching audit logs:", logError);
    } else {
        console.log(`Found ${logs.length} 'request_contact' events in audit logs.`);
        logs.slice(0, 5).forEach(l => {
            console.log(`Log ID: ${l.id} | Match ID: ${l.entity_id} | Actor: ${l.actor_id} | Time: ${l.created_at}`);
        });
    }

    console.log("--- DIAGNOSTIC END ---");
}

diagnose();
