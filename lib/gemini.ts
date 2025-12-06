import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeJob(jobText: string, userProfile?: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const profileContext = userProfile ? `
    CANDIDATE PROFILE:
    - Skills: ${userProfile.skills?.join(', ') || 'None listed'}
    - Target Role: ${userProfile.target_role || 'Not specified'}
    - Location: ${userProfile.location || 'Not specified'}
    
    IMPORTANT: Compare the Job Description requirements against this specific Candidate Profile.
    When identifying gaps, ONLY list skills that are required by the job but MISSING or weak in the candidate's profile.
  ` : 'CANDIDATE PROFILE: Generic mid-level candidate (No specific profile provided).';

  const prompt = `
    You are an expert career coach and software engineer. Analyze the following job description and output JSON only.
    
    ${profileContext}

    Job Description:
    "${jobText.slice(0, 5000)}"

    Tasks:
    1. Extract skills with levels (must/optional) and priority (1-5).
    2. For each skill give a 1-sentence simple explanation.
    3. Identify potential gaps based on the CANDIDATE PROFILE provided above. 
       - If the candidate has the skill, do NOT list it as a gap.
       - If the candidate is missing a critical skill found in the job description, list it as a gap.
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
        {"skill": "Skill Name", "reason": "Missing from candidate profile but required for job", "recommended_days": 5}
      ],
      "roadmap": {
        "Skill Name": [{"day": 1, "task": "Task description"}]
      },
      "cv_suggestions": ["Bullet point 1", "Bullet point 2"]
    }
  `;

  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-flash-latest',
    'gemini-1.5-flash' // Keeping as fallback just in case
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return parseResponse(response.text());
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // If we get here, all models failed
  console.error('All Gemini models failed. Last error:', lastError);
  throw lastError || new Error('All Gemini models failed to generate content');
}

export async function extractSkillsFromResume(resumeText: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an expert recruiter. Extract key information from the following resume text and output JSON only.

    Resume Text:
    "${resumeText.slice(0, 10000)}"

    Tasks:
    1. Extract a list of comprehensive technical and soft skills.
    2. Identify the candidate's most likely target role / job title.

    Output Format (JSON):
    {
      "skills": ["Skill 1", "Skill 2", ...],
      "target_role": "Senior Frontend Developer"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini Raw Response:', text.substring(0, 100));
    return parseResponse(text);
  } catch (error) {
    console.error('Gemini Resume Extraction Failed:', error);
    return { skills: [], target_role: '' };
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
