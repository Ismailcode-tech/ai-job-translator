import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeJob(jobText: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

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

  // Try Gemini 1.5 Flash first
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error: any) {
    // Fallback to Gemini Pro if 1.5 Flash is not found (404)
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      console.warn('Gemini 1.5 Flash not found, falling back to gemini-pro');
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await fallbackModel.generateContent(prompt);
      const response = await result.response;
      return parseResponse(response.text());
    }
    throw error;
  }
}

function parseResponse(text: string) {
  // Clean up markdown code blocks if present (Gemini sometimes wraps JSON in ```json ... ```)
  const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('Invalid JSON response from Gemini');
  }
}
