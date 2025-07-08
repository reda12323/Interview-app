// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Award, BarChart3 } from 'lucide-react';
import './dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="header-title">AI Interview Simulator</h1>
              <p className="header-subtitle">Practice your interview skills with AI feedback</p>
            </div>
            <div className="header-buttons">
              <Link to="/login" className="button button-outline">Login</Link>
              <Link to="/signup" className="button button-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Master Your Next Interview with AI</h2>
            <p className="hero-description">
              Get personalized interview practice with real-time feedback, voice interaction, 
              and intelligent question generation based on any job description.
            </p>
            <div className="hero-buttons">
              <Link to="/paste-job" className="button button-primary button-lg">
                <Play className="icon" />
                Start Practice Interview
              </Link>
              <Link to="/about" className="button button-outline button-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h3 className="features-title">Why Choose Our AI Interview Simulator?</h3>
            <p className="features-subtitle">
              Our advanced AI technology provides realistic interview experiences 
              tailored to your specific role and industry.
            </p>
          </div>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon-container">
                <Play className="feature-icon" />
              </div>
              <h4 className="feature-card-title">Dynamic Questions</h4>
              <p className="feature-card-content">
                AI generates personalized interview questions based on your job description 
                and adjusts difficulty based on role complexity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Users className="feature-icon" />
              </div>
              <h4 className="feature-card-title">Voice Interaction</h4>
              <p className="feature-card-content">
                Practice with natural speech recognition and text-to-speech technology 
                for a realistic interview experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Award className="feature-icon" />
              </div>
              <h4 className="feature-card-title">Instant Feedback</h4>
              <p className="feature-card-content">
                Get immediate AI-powered feedback on your answers to improve 
                your interview performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Interviews Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies Practiced</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-card">
            <h3 className="cta-title">Ready to Ace Your Next Interview?</h3>
            <p className="cta-content">
              Join thousands of job seekers who have improved their interview skills 
              with our AI-powered platform.
            </p>
            <Link to="/interview" className="button button-primary button-lg">
              <Play className="icon" />
              Start Your First Interview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 AI Interview Simulator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;