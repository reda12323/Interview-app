import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resumeResult.css'; // Use the same styles as Results

const ResumeResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { evaluationResult, qaPairs } = state || {};

  const filteredQA = qaPairs?.slice(1) || [];
  const filteredResults = evaluationResult?.results?.slice(1) || [];

  const maxScore = filteredResults.length * 10;

  if (!evaluationResult || !qaPairs) {
    return (
      <div className="results-container">
        <div className="error-panel">
          <h2>🚫 No Results Available</h2>
          <p>Please complete an interview session to view analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <header className="results-header">
        <h1>📊 Resume-Based Interview Analysis</h1>
        <div className="overall-score-card">
          <div
            className="score-radial"
            style={{
              '--score': `${(evaluationResult.overallScore / maxScore) * 100}%`,
              '--color': `hsl(${(evaluationResult.overallScore / maxScore) * 120}, 70%, 50%)`,
            }}
          >
            <span>{evaluationResult.overallScore}/{maxScore}</span>
          </div>
          <div className="score-details">
            <h2>Overall Score</h2>
            <p>{Math.round((evaluationResult.overallScore / maxScore) * 100)}% Success Rate</p>
          </div>
        </div>
      </header>

      <section className="cv-feedback-section">
        <div className="section-header">
          <h3> Suggested Improvements to Your CV</h3>
          <div className="section-subtitle">
            Recommendations based on your answers and resume
          </div>
        </div>
        <ul className="cv-feedback-list">
          {evaluationResult.cvSuggestions?.map((suggestion, index) => (
            <li key={index} className="cv-feedback-item">
              {suggestion}
            </li>
          ))}
        </ul>
      </section>

      <section className="detailed-analysis">
        <div className="section-header">
          <h3> Question-by-Question Analysis</h3>
          <div className="section-subtitle">
            Feedback based on your resume content
          </div>
        </div>

        <div className="analysis-cards">
          {filteredResults.map((result, i) => (
            <div key={i} className="analysis-card">
              <div className="card-header">
                <div className="question-meta">
                  <span className="question-number">Q{i + 1}</span>
                  <div className="score-indicator">
                    <div
                      className="score-bar"
                      style={{ width: `${result.score * 10}%` }}
                    ></div>
                    <span>{result.score}/10</span>
                  </div>
                </div>
                <h4>{filteredQA[i]?.question}</h4>
              </div>
              <div className="card-body">
                <div className="answer-section">
                  <h5>🎤 Your Response:</h5>
                  <p>{filteredQA[i]?.answer}</p>
                </div>
                <div className="feedback-section">
                  <h5>💡 Expert Feedback:</h5>
                  <p>{result.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={() => navigate('/resume-upload')} className="back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default ResumeResults;
