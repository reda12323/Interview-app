const axios = require('axios');

const sessions = {};

exports.generateResumeQuestionsDirect = async (resumeText) => {
  const prompt = `
You are an AI interviewer. Based on this candidate's resume:

Resume:
${resumeText}

Generate 5 thoughtful interview questions.
Return them as a JSON array of strings. No labels or numbering.
`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  let text = response.data.choices[0].message.content.trim();
  let questions;
  try {
    questions = JSON.parse(text);
  } catch {
    questions = text.split('\n').filter(Boolean);
  }

  const sessionId = Math.random().toString(36).substring(2, 10);
  sessions[sessionId] = questions;

  return sessionId;
};

exports.getResumeInterviewSession = (req, res) => {
  const { sessionId } = req.params;
  const questions = sessions[sessionId];
  if (!questions) return res.status(404).json({ error: 'Session not found' });
  res.json({ questions });
};

exports.evaluateResumeAnswers = async (req, res) => {
  const { resumeText, answers } = req.body;

  if (!resumeText || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing resumeText or answers' });
  }

  const prompt = `
You're an expert tech recruiter. Review the candidate’s resume and interview answers.

Resume:
${resumeText}

Interview Answers:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Return a JSON object with:
- "overallScore": total score out of 50
- "cvSuggestions": an array of 3–5 specific suggestions to improve their CV
- "results": an array of objects with "question", "answer", "score" (out of 10), and "feedback"

Format:
{
  "overallScore": number,
  "cvSuggestions": [string],
  "results": [
    {
      "question": string,
      "answer": string,
      "score": number,
      "feedback": string
    }
  ]
}
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);

    // ✅ Round scores and calculate total
    result.results = result.results.map(r => ({
      ...r,
      score: Math.round(r.score || 0),
    }));
    result.overallScore = result.results.reduce((sum, r) => sum + r.score, 0);

    res.json(result);
  } catch (err) {
    console.error('Evaluation error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
};


