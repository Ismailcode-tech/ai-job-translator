import OpenAI from 'openai';

// Initialize OpenAI client
// Requires OPENAI_API_KEY in environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key', // Fallback for build time
    dangerouslyAllowBrowser: false, // Server-side only
});

export async function analyzeJob(jobText: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY');
    }

    const prompt = `
    You are an expert career coach and software engineer. Analyze the following job description and output JSON only.
    
    Job Description:
    "${jobText.slice(0, 3000)}" // Truncate to avoid token limits if extremely long

    Tasks:
    1. Extract skills with levels (must/optional) and priority (1-5).
    2. For each skill give a 1-sentence simple explanation.
    3. Identify potential gaps (assume a generic mid-level profile for now, or just list common hard skills as gaps).
    4. Output a 3-day learning roadmap for the top 3 hardest skills.
    5. Provide 3 CV bullet suggestions tailored to highlight match.

    Output Format (JSON):
    {
      "title": "Job Title Detected",
      "category": "Category (IT, Marketing, etc)",
      "match_score": 85,
      "skills": [
        {"name": "Skill Name", "must": true, "priority": 5, "explanation": "Simple explanation", "confidence": 0.9}
      ],
      "gaps": [
        {"skill": "Skill Name", "reason": "Commonly missing", "recommended_days": 5}
      ],
      "roadmap": {
        "Skill Name": [{"day": 1, "task": "Task description"}]
      },
      "cv_suggestions": ["Bullet point 1", "Bullet point 2"]
    }
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a helpful assistant that outputs JSON.' }, { role: 'user', content: prompt }],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No content returned from OpenAI');

    return JSON.parse(content);
}
