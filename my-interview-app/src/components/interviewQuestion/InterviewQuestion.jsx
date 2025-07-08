import React, { useEffect, useState } from 'react';
import { Send, Lightbulb, RefreshCcw, MessageSquareText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './interviewQuestion.css';

const examples = [
    { question: "Tell me about yourself.", answer: "I'm a software engineer with 3 years of experience in building scalable web applications." },
    { question: "What are your strengths?", answer: "I'm highly analytical and thrive under pressure, often delivering ahead of schedule." },
    { question: "Why should we hire you?", answer: "I bring a unique mix of skills and passion that aligns perfectly with your company’s mission." },
    { question: "Where do you see yourself in 5 years?", answer: "Growing into a leadership role while continuing to build impactful tech." },
    { question: "What is your greatest weakness?", answer: "I tend to overanalyze things, but I’m learning to balance speed and precision." },
];

const InterviewQuestion = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation();
      const uid = location.state?.uid || localStorage.getItem('uid');
    

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % examples.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer('');

        try {
            const response = await fetch('http://localhost:5000/custom-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question,uid  }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnswer(data.answer);
            } else {
                setAnswer('❌ Something went wrong: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Frontend error:', error);
            setAnswer('❌ Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const getCardClass = (index) => {
        const offset = (index - currentIndex + examples.length) % examples.length;
        if (offset === 0) return "card center";
        if (offset === 1 || offset === -examples.length + 1) return "card right";
        if (offset === examples.length - 1 || offset === -1) return "card left";
        return "card hidden";
    };

    return (
        <div className="interview-container">
            <h1><MessageSquareText size={28} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Ask an Interview Question</h1>

            <div className="question-input-section">
                <textarea
                    placeholder="Type your interview question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button onClick={handleAskQuestion} disabled={loading}>
                    {loading ? <RefreshCcw className="spin" size={18} /> : <Send size={18} style={{ marginRight: 6 }} />}
                    {loading ? ' Thinking...' : ' Get Answer'}
                </button>
            </div>

            {answer && (
                <div className="answer-box">
                    <h3><Lightbulb size={20} style={{ marginRight: 6 }} /> Suggested Answer:</h3>
                    <p>{answer}</p>
                </div>
            )}

            <div className="examples-section">
                <h2><RefreshCcw size={20} style={{ marginRight: 6 }} /> Interview Q&A Carousel</h2>
                <div className="carousel">
                    {examples.map((item, i) => (
                        <div key={i} className={getCardClass(i)}>
                            <h4>Q: {item.question}</h4>
                            <p><strong>A:</strong> {item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterviewQuestion;
