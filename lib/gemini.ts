import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function analyzeJob(jobText: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    You are an expert career coach and software engineer. Analyze the following job description and output JSON only.
    
    Job Description:
    "${jobText.slice(0, 5000)}"

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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Clean up markdown code blocks if present (Gemini sometimes wraps JSON in ```json ... ```)
  const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('Invalid JSON response from Gemini');
  }
}
