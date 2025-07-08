import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home.jsx';
import Interview from './components/interview/Interview.jsx';
import Results from './components/results/Results.jsx';
import ResumeUpload from './components/resume/ResumeUpload.jsx';
import ResumeInterview from './components/resume/ResumeInterview.jsx';
import ResumeResults from './components/resume/ResumeResults.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import InterviewQuestion from './components/interviewQuestion/InterviewQuestion.jsx';
import LayoutWithNavbar from './components/navbar/LayoutWithNavbar.jsx';
import Auth from './components/authentification/Auth.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/paste-job" element={<Home />} />
          <Route path="/interview/:sessionId" element={<Interview />} />
          <Route path="/results" element={<Results />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/resume-interview/:sessionId" element={<ResumeInterview />} />
          <Route path="/resume-results" element={<ResumeResults />} />
          <Route path="/interview-question" element={<InterviewQuestion />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
