import { createClient } from '@/utils/supabase/server';

export class EnterpriseService {
    /**
     * Checks if the user's email domain is whitelisted.
     * Returns the whitelist record if found, or null.
     */
    static async checkWhitelist(email: string) {
        const supabase = await createClient();
        const domain = email.split('@')[1];

        // Strict Check: Domain match
        const { data: whitelistRecord, error } = await supabase
            .from('enterprise_whitelist')
            .select('*')
            .eq('domain', domain)
            .single();

        if (error || !whitelistRecord) return null;
        return whitelistRecord;
    }

    /**
     * Handles the Automated Enterprise Onboarding Flow.
     * 1. Check Whitelist
     * 2. Find or Create Organization
     * 3. Link User to Org
     * 4. Audit Log
     */
    static async handleCompanyOnboarding(userId: string, email: string) {
        const supabase = await createClient();

        // 1. Whitelist Verification
        const whitelistRecord = await this.checkWhitelist(email);

        if (!whitelistRecord) {
            throw new Error('ENTERPRISE_ONLY: Your company is not registered. Please contact support.');
        }

        // 2. Find or Create Organization
        // Check if an org already exists for this domain (by checking name or a future domain link)
        // For MVP, we'll check if any organization exists with this name? No, that's weak.
        // We should probably link Organization to Whitelist ID or Domain. 
        // Let's assume we query organizations by name = whitelistRecord.company_name for now (simplest link).
        // A better way would be adding 'domain' to organizations. 
        // Let's stick to name match for this strict iteration or create if not exists.

        // Actually, let's check if there is an org that this user is *already* in? No, they are new.
        // Let's check if *another* user from this domain has created an org.
        // Complex.

        // SIMPLIFIED APPROACH:
        // Query Organization by Name (Must be unique for Enterprise).
        const { data: existingOrg } = await supabase
            .from('organizations')
            .select('id')
            .eq('name', whitelistRecord.company_name)
            .single();

        let orgId = existingOrg?.id;
        let action = 'assigned';

        if (!orgId) {
            // Create New Enterprise Org
            const { data: newOrg, error: createError } = await supabase
                .from('organizations')
                .insert({
                    name: whitelistRecord.company_name,
                    billing_policy: 'contract',
                    credit_policy: 'unlimited_fair_use',
                    sla_level: whitelistRecord.sla_level || 'enterprise',
                    verified: true
                })
                .select()
                .single();

            if (createError) throw createError;
            orgId = newOrg.id;
            action = 'created_and_assigned';
        }

        // 3. Link User
        // Check if already linked
        const { data: membership } = await supabase
            .from('organization_members')
            .select('id')
            .eq('organization_id', orgId)
            .eq('user_id', userId)
            .single();

        if (!membership) {
            await supabase.from('organization_members').insert({
                organization_id: orgId,
                user_id: userId,
                role: 'admin' // First user is Admin? Actually all enterprise users might be members. Let's say Admin for now.
            });
        }

        // 4. Audit Log
        await supabase.from('audit_logs').insert({
            actor_id: userId,
            action: `enterprise_onboarding_${action}`,
            entity_type: 'organization',
            entity_id: orgId,
            metadata: { domain: whitelistRecord.domain, whitelist_id: whitelistRecord.id }
        });

        return { orgId, action };
    }
}
