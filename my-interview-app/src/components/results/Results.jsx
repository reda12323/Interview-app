import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluationResult, qaPairs } = location.state || {};

  // Skip first question (warm-up)
  const filteredResults = evaluationResult?.results?.slice(1) || [];
  const filteredQA = qaPairs?.slice(1) || [];

  // ✅ Compute total score based on question results
  const totalScore = filteredResults.reduce((sum, r) => sum + r.score, 0);
  const maxScore = filteredResults.length * 10;

  if (!evaluationResult) {
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
        <h1>📊 Interview Performance Analysis</h1>
        <div className="overall-score-card">
          <div
            className="score-radial"
            style={{
              '--score': `${(totalScore / maxScore) * 100}%`,
              '--color': `hsl(${(totalScore / maxScore) * 120}, 70%, 50%)`,
            }}
          >
            <span>{totalScore}/{maxScore}</span>
          </div>
          <div className="score-details">
            <h2>Overall Score</h2>
            <p>{Math.round((totalScore / maxScore) * 100)}% Success Rate</p>
          </div>
        </div>
      </header>

      <section className="honeycomb-section">
        <div className="section-header">
          <h3>🐝 Key Job Requirements</h3>
          <div className="section-subtitle">
            Core competencies needed for this position
          </div>
        </div>
        <div className="honeycomb-grid">
          {evaluationResult.keySkills.map((skill, i) => (
            <div key={i} className="hexagon">
              <div className="hex-content">{skill}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="detailed-analysis">
        <div className="section-header">
          <h3>📝 Question-by-Question Analysis</h3>
          <div className="section-subtitle">
            Detailed feedback on your responses
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

      <button onClick={() => navigate('/paste-job')} className="back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default Results;




// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import './results.css';

// const Results = () => {
//   const location = useLocation();
//   const { evaluationResult, qaPairs } = location.state || {};

//   // Skip first question (warm-up)
//   const filteredQA = qaPairs?.slice(1) || [];
//   const filteredResults = evaluationResult?.results || [];
//   const maxScore = filteredResults.length * 10;

//   if (!evaluationResult) {
//     return (
//       <div className="results-container">
//         <div className="error-panel">
//           <h2>🚫 No Results Available</h2>
//           <p>Please complete an interview session to view analysis.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="results-container">
//       <header className="results-header">
//         <h1>📊 Interview Performance Analysis</h1>
//         <div className="overall-score-card">
//           <div className="score-radial" style={{ 
//             '--score': `${(evaluationResult.overallScore/maxScore)*100}%`,
//             '--color': `hsl(${(evaluationResult.overallScore/maxScore)*120}, 70%, 50%)`
//           }}>
//             <span>{evaluationResult.overallScore}/{maxScore}</span>
//           </div>
//           <div className="score-details">
//             <h2>Overall Score</h2>
//             <p>{Math.round((evaluationResult.overallScore/maxScore)*100)}% Success Rate</p>
//           </div>
//         </div>
//       </header>

//       <section className="honeycomb-section">
//         <div className="section-header">
//           <h3>🐝 Key Job Requirements</h3>
//           <div className="section-subtitle">
//             Core competencies needed for this position
//           </div>
//         </div>
//         <div className="honeycomb-grid">
//           {evaluationResult.keySkills.map((skill, i) => (
//             <div key={i} className="hexagon">
//               <div className="hex-content">
//                 {skill}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="detailed-analysis">
//         <div className="section-header">
//           <h3>📝 Question-by-Question Analysis</h3>
//           <div className="section-subtitle">
//             Detailed feedback on your responses
//           </div>
//         </div>
        
//         <div className="analysis-cards">
//           {filteredResults.map((result, i) => (
//             <div key={i} className="analysis-card">
//               <div className="card-header">
//                 <div className="question-meta">
//                   <span className="question-number">Q{i+1}</span>
//                   <div className="score-indicator">
//                     <div className="score-bar" 
//                          style={{ width: `${result.score*10}%` }}>
//                     </div>
//                     <span>{result.score}/10</span>
//                   </div>
//                 </div>
//                 <h4>{filteredQA[i]?.question}</h4>
//               </div>
//               <div className="card-body">
//                 <div className="answer-section">
//                   <h5>🎤 Your Response:</h5>
//                   <p>{filteredQA[i]?.answer}</p>
//                 </div>
//                 <div className="feedback-section">
//                   <h5>💡 Expert Feedback:</h5>
//                   <p>{result.feedback}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Results;