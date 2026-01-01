/**
 * AI Safety & Validation Module
 * Enforces guardrails on AI outputs before they enter the Mediator Ledger.
 */

export class AISafety {
    private static PII_PATTERNS = [
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email
        /(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, // Phone (Simple)
        /https?:\/\/[^\s]+/g, // URLs (Links to profiles/portfolios)
    ];

    /**
     * scrubbing PII from the match reason/content.
     * We want the AI to explain the match *qualitatively* (skills, experience),
     * not by revealing identity.
     */
    static scrubPII(text: string): string {
        let scrubbed = text;
        this.PII_PATTERNS.forEach(pattern => {
            scrubbed = scrubbed.replace(pattern, '[REDACTED]');
        });
        return scrubbed;
    }

    /**
     * Validates the confidence score.
     * Returns a status flag or boolean.
     */
    static validateConfidence(score: number): 'high' | 'medium' | 'low' {
        if (score >= 85) return 'high';
        if (score >= 70) return 'medium';
        return 'low';
    }

    /**
     * Main validation pipeline
     */
    static validateMatch(score: number, reason: string) {
        const confidence = this.validateConfidence(score);
        const safeReason = this.scrubPII(reason);

        return {
            isValid: confidence !== 'low', // We might reject 'low' matches
            confidence,
            safeReason
        };
    }
}
