const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');


const interviewRoutes = require('./routes/interviewRoutes');
const resumeInterviewRoutes = require('./routes/resumeInterviewRoutes');
const interviewQuestionRoutes = require('./routes/InterviewQuestionRoutes');
const firebaseAuthRoutes = require('./routes/firebaseAuthRoutes');


const mongoURI = "mongodb+srv://redalextayzi:reda12323@cluster0.dljva.mongodb.net/pfe?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.use('/', interviewRoutes);
app.use('/', resumeInterviewRoutes);
app.use('/', interviewQuestionRoutes);
app.use('/', firebaseAuthRoutes);
app.use("/admin", adminRoutes);



mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));































// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 5000;

// const sessions = {};  // Simple in-memory store; replace with DB for production

// app.post('/generate-questions', async (req, res) => {
//   const { jobDescription } = req.body;
//   if (!jobDescription) return res.status(400).json({ error: 'Job description required' });

//   const maxQuestions = 5;
//   const prompt = `
// You are conducting a job interview for this position:

// Job Description:
// ${jobDescription}

// First, start with a friendly warm-up like "Hi, how are you? Ready for the interview?".
// Then generate ${maxQuestions} natural interview questions related to the job description.

// Return the questions only, each as a separate item, no numbering, no labels.

// Format your response as a JSON array of strings.
//   `;

//   try {
//     const response = await axios.post(
//       'https://openrouter.ai/api/v1/chat/completions',
//       {
//         model: 'openai/gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//           'HTTP-Referer': 'http://localhost:3000',
//           'X-Title': 'Smart Interviewer',
//         },
//       }
//     );

//     let text = response.data.choices[0].message.content.trim();
//     let questions;
//     try {
//       questions = JSON.parse(text);
//     } catch {
//       questions = text.split('\n').filter(Boolean);
//     }

//     // Generate a session ID and store questions
//     const sessionId = Math.random().toString(36).substring(2, 10);
//     sessions[sessionId] = questions;

//     res.json({ sessionId, questions });
//   } catch (error) {
//     console.error('OpenAI API error:', error.message);
//     res.status(500).json({ error: 'Failed to generate questions' });
//   }
// });

// app.get('/interview/:sessionId', (req, res) => {
//   const { sessionId } = req.params;
//   const questions = sessions[sessionId];

//   if (!questions) return res.status(404).json({ error: 'Session not found' });

//   res.json({ questions });
// });

// app.post('/evaluate-answers', async (req, res) => {
//   const { jobDescription, answers } = req.body;
//   if (!jobDescription || !answers) {
//     return res.status(400).json({ error: 'Missing job description or answers' });
//   }

//   const prompt = `
// You're an expert job interviewer. Given the job description and the following candidate responses, evaluate the answers.

// Job Description:
// ${jobDescription}

// Evaluate each Q&A pair with:
// - Score out of 10
// - Constructive feedback for improvement

// Also summarize key job skills the candidate needs.

// Return format:
// {
//   "overallScore": number,
//   "keySkills": [string, ...],
//   "results": [
//     {
//       "question": "...",
//       "answer": "...",
//       "score": number,
//       "feedback": "..."
//     }
//   ]
// }

// Candidate Answers:
// ${answers.map((a, i) => `Q${i+1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}
// `;

//   try {
//     const response = await axios.post(
//       'https://openrouter.ai/api/v1/chat/completions',
//       {
//         model: 'openai/gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.4,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const text = response.data.choices[0].message.content;
//     const parsed = JSON.parse(text);
//     res.json(parsed);
//   } catch (err) {
//     console.error('Evaluation error:', err.message);
//     res.status(500).json({ error: 'Failed to evaluate answers' });
//   }
// });




// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
