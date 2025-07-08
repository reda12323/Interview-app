//Interview Question Controller
const axios = require('axios');
const InterviewQA = require('../models/InterviewQA');

const getAnswerOfQuestion = async (req, res) => {
  const { question, uid } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const prompt = `
You are an AI Interview Coach helping candidates prepare for job interviews.

Your task:
- Provide medium-length, professional, and realistic answers.
- Answer as if the candidate is in a real interview: not too short, not too long.
- Do NOT answer anything unrelated to interviews or job preparation.

If the question is not relevant to interviews, respond with:
"❌ Sorry, I can only help with interview-related questions."

Question:
"${question}"

Return only the answer as plain text.
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
          'X-Title': 'Smart Interview Answerer',
        },
      }
    );

    const aiAnswer = response.data.choices?.[0]?.message?.content;

    const savedQA = new InterviewQA({ uid, question, answer: aiAnswer });
    await savedQA.save();
    return res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get an answer from AI.' });
  }
};

module.exports = { getAnswerOfQuestion };
