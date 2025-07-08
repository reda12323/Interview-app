import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation  } from 'react-router-dom';
import './home.css'; // Import the CSS

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const uid = (location.state && location.state.uid) || localStorage.getItem('uid');

  const generateQuestions = async () => {
    try {
      if (!jobDescription.trim()) return;
      localStorage.setItem('jobDescription', jobDescription);
      const res = await axios.post('http://localhost:5000/generate-questions', {
        jobDescription,
        userId: uid,
      });
      const { sessionId } = res.data;
      navigate(`/interview/${sessionId}`);
    } catch (err) {
      console.error('Error generating questions', err);
    }
  };

  const useSample = () => {
  setJobDescription(`Frontend Developer with React Experience

We are looking for a skilled Frontend Developer with strong React experience to join our team. The ideal candidate should have:

- 3+ years of experience with React and modern JavaScript
- Proficiency with HTML, CSS, and responsive design
- Experience with state management (Redux, Context API)
- Knowledge of testing frameworks (Jest, React Testing Library)
- Familiarity with build tools like Webpack and Babel
- Excellent problem-solving and communication skills

You'll be working on developing new features, improving existing ones, and collaborating with designers and backend developers to create seamless user experiences.`);
};


  return (
    <div className="home-container">
      <h1 className="home-title">AI Interview Simulator</h1>
      <p className="home-subtitle">
        Practice your interview skills with our AI interviewer. Paste a job description, and the AI will ask
        you relevant questions. Speak your answers naturally as you would in a real interview.
      </p>

      <div className="home-card">
        <h2 className="section-title">Job Description</h2>
        <p className="section-subtitle">
          Paste the job description below, and our AI will generate relevant interview questions based on it.
        </p> <br />
        <textarea
          className="job-textarea"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className="button-row">
          <button className="btn-outline" onClick={useSample}>
            Use Sample
          </button>
          <button className="btn-primary" onClick={generateQuestions}>
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
