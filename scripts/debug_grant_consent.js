const { createClient } = require('@supabase/supabase-js');
const { MediatorService } = require('../lib/mediator/service');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugGrant() {
    const matchId = '03494dc8-e5de-413c-87f2-0a3b23962e47'; // The consented match
    const userId = 'ce0abbd7-f5b6-42ef-a57c-c1c645a5f9dd'; // The candidate

    console.log("Debugging grantConsent...");
    try {
        await MediatorService.grantConsent(matchId, userId, ['contact_info'], supabase);
        console.log("Success!");
    } catch (e) {
        console.error("Caught error:", e.message);
    }
}

debugGrant();
