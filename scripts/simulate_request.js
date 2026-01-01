const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// We need a standard client to simulate RLS or a service role to bypass.
// The service method itself uses createClient() (server utils) which uses env vars.
// But here we'll pass the client or mock the environment.

const { MediatorService } = require('../lib/mediator/service');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateRequest() {
    const matchId = '03494dc8-e5de-413c-87f2-0a3b23962e47'; // Match for Senior Frontend
    const companyId = '0ea15b15-9735-427d-a149-f4acf5118e9e'; // Owner of that job

    console.log(`Simulating Request Contact for Match ${matchId} by Company ${companyId}...`);

    try {
        // We need to provide the MediatorService with a client that can perform the update.
        // The service normally uses createClient() which expects cookies in Next.js.
        // Here we'll pass our service role client.

        await MediatorService.requestContact(matchId, companyId, supabase);
        console.log("Request successful!");

        // Check final status
        const { data: match } = await supabase.from('mediator_matches').select('status').eq('id', matchId).single();
        console.log(`Final Match Status: ${match.status}`);

    } catch (error) {
        console.error("Simulation failed:", error);
    }
}

simulateRequest();
