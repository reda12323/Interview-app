const axios = require('axios');
const JobInterview = require('../models/JobInterview');

const sessions = {}; // Simple in-memory store

exports.generateQuestions = async (req, res) => {
  const { jobDescription, userId } = req.body;
  if (!jobDescription) return res.status(400).json({ error: 'Job description required' });

  const maxQuestions = 5;
  const prompt = `
You are conducting a job interview for this position:

Job Description:
${jobDescription}

First, start with a friendly warm-up like "Hi, how are you? Ready for the interview?".
Then generate ${maxQuestions} natural interview questions related to the job description.

Return the questions only, each as a separate item, no numbering, no labels.

Format your response as a JSON array of strings.
  `;

  try {
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
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Smart Interviewer',
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

    const newJobInterview = new JobInterview({
      uid: userId,
      jobDescription
    });

    await newJobInterview.save();
    res.json({ sessionId, questions });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
};

exports.getInterviewSession = (req, res) => {
  const { sessionId } = req.params;
  const questions = sessions[sessionId];
  if (!questions) return res.status(404).json({ error: 'Session not found' });
  res.json({ questions });
};

exports.evaluateAnswers = async (req, res) => {
  const { jobDescription, answers } = req.body;
  if (!jobDescription || !answers) {
    return res.status(400).json({ error: 'Missing job description or answers' });
  }

  const prompt = `
You're an expert job interviewer. Given the job description and the following candidate responses, evaluate the answers.

Job Description:
${jobDescription}

Evaluate each Q&A pair with:
- Score out of 10
- Constructive feedback for improvement

Also summarize key job skills the candidate needs.

Return format:
{
  "overallScore": number,
  "keySkills": [string, ...],
  "results": [
    {
      "question": "...",
      "answer": "...",
      "score": number,
      "feedback": "..."
    }
  ]
}

Candidate Answers:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}
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

    const text = response.data.choices[0].message.content;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error('Evaluation error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
};
