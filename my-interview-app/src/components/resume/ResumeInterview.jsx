import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../interview/interview.css';


const ResumeInterview = () => {
    const { sessionId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [prefixedQuestions, setPrefixedQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [subtitleOpen, setSubtitleOpen] = useState(false);
    const [subtitleLog, setSubtitleLog] = useState([]);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const navigate = useNavigate();
    const [availableVoices, setAvailableVoices] = useState([]);
        const [isEvaluating, setIsEvaluating] = useState(false);

    


    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const wasMicOnRef = useRef(false);

    const warmUpQuestion = "Hi, how are you? Thank you for joining the interview today. Are you Ready for the interview?";
    const prefixes = [
        "Great,", "Okay,", "Thanks,", "Alright,", "Perfect,", "Cool,",
        "Sounds good,", "Excellent,", "Nice,"
    ];

    useEffect(() => {
        axios.get(`http://localhost:5000/resume-interview/${sessionId}`)
            .then(res => {
                setQuestions(res.data.questions);
            })
            .catch(err => console.error('Error loading questions', err));
    }, [sessionId]);

    useEffect(() => {
        if (questions.length > 0) {
            const withPrefixes = questions.map(q =>
                `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${q}`
            );
            setPrefixedQuestions([warmUpQuestion, ...withPrefixes]);
        }
    }, [questions]);

    useEffect(() => {
        if (prefixedQuestions.length > 0 && currentIndex < prefixedQuestions.length) {
            const currentQuestion = prefixedQuestions[currentIndex];

            // Prevent duplicates in subtitleLog
            setSubtitleLog(prev => {
                const isDuplicate = prev.some(
                    entry => entry.who === 'AI' && entry.text === currentQuestion
                );
                return isDuplicate ? prev : [...prev, { who: 'AI', text: currentQuestion }];
            });

            speakText(currentQuestion);
        }
    }, [prefixedQuestions, currentIndex]);


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech Recognition not supported");

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onstart = () => setIsUserSpeaking(true);

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            const userResponse = result[0].transcript;

            if (result.isFinal) {
                setSubtitleLog(prev => [...prev, { who: 'You', text: userResponse }]);
                setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
            }
        };

        recognition.onerror = () => setIsUserSpeaking(false);
        recognition.onend = () => {
            setIsUserSpeaking(false);
            if (!isAISpeaking) setIsMicOn(false);
        };

        recognitionRef.current = recognition;
    }, [isAISpeaking]);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setAvailableVoices(voices);
            } else {
                // In some browsers, voices are not loaded immediately
                window.speechSynthesis.onvoiceschanged = () => {
                    const updatedVoices = window.speechSynthesis.getVoices();
                    setAvailableVoices(updatedVoices);
                };
            }
        };

        loadVoices();
    }, []);

    useEffect(() => {
        if (isCameraOn) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    setIsCameraOn(false);
                });
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) videoRef.current.srcObject = null;
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOn]);

    const speakText = (text) => {
        const utter = new SpeechSynthesisUtterance(text);

        const voice = availableVoices.find(v =>
            v.name.includes('Emma') || v.name.includes('Brian')
        );

        if (voice) utter.voice = voice;
        utter.rate = 1;
        window.speechSynthesis.cancel();

        wasMicOnRef.current = isMicOn;

        utter.onstart = () => {
            setIsAISpeaking(true);
            if (isMicOn) {
                recognitionRef.current?.stop();
                setIsMicOn(false);
            }
        };

        utter.onend = () => {
            setIsAISpeaking(false);
            if (wasMicOnRef.current) {
                setTimeout(() => {
                    recognitionRef.current?.start();
                    setIsMicOn(true);
                }, 500);
            }
        };

        window.speechSynthesis.speak(utter);
    };

    const endInterview = async () => {
        // Stop voice input/output
        window.speechSynthesis.cancel();
        recognitionRef.current?.stop();

        const qaPairs = [];
        let currentQuestion = null;

        subtitleLog.forEach(entry => {
            if (entry.who === 'AI') {
                currentQuestion = entry.text;
            } else if (entry.who === 'You' && currentQuestion) {
                qaPairs.push({
                    question: currentQuestion,
                    answer: entry.text
                });
                currentQuestion = null;
            }
        });

        if (qaPairs.length === 0) {
            alert("No Q&A pairs found to evaluate.");
            return;
        }

        const jobDescription = localStorage.getItem('jobDescription');
        const resumeText = localStorage.getItem('resumeText');

        if (!resumeText) {
            alert("Resume text is missing.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/evaluate-resume-answers', {
                resumeText,
                answers: qaPairs
            });

            navigate('/resume-results', {
                state: {
                    evaluationResult: res.data,
                    qaPairs
                }
            });
        } catch (err) {
            console.error('Error evaluating interview:', err);
            alert('Failed to evaluate interview.');
        }
    };


    const toggleMic = () => {
        if (isMicOn) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsMicOn(!isMicOn);
    };

    const toggleCamera = () => setIsCameraOn(prev => !prev);

    // Update the evaluation useEffect in Interview.jsx:
    // useEffect(() => {
    //     if (currentIndex >= prefixedQuestions.length && subtitleLog.length > 0) {
    //         const qaPairs = [];
    //         let currentQuestion = null;

    //         subtitleLog.forEach(entry => {
    //             if (entry.who === 'AI') {
    //                 currentQuestion = entry.text;
    //             } else if (entry.who === 'You' && currentQuestion) {
    //                 qaPairs.push({
    //                     question: currentQuestion,
    //                     answer: entry.text
    //                 });
    //                 currentQuestion = null;
    //             }
    //         });

    //         if (qaPairs.length === 0) {
    //             console.error("No Q&A pairs to evaluate.");
    //             return;
    //         }

    //         const jobDescription = localStorage.getItem('jobDescription');
    //         if (!jobDescription) {
    //             console.error("Job description not found in localStorage.");
    //             return;
    //         }

    //         const resumeText = localStorage.getItem('resumeText');
    //         if (!resumeText) {
    //             console.error("Resume text not found in localStorage.");
    //             return;
    //         }

    //         axios.post('http://localhost:5000/evaluate-resume-answers', {
    //             resumeText,
    //             answers: qaPairs
    //         })
    //             .then(res => {
    //                 navigate('/resume-results', {
    //                     state: {
    //                         evaluationResult: res.data,
    //                         qaPairs // Pass Q&A pairs for display
    //                     }
    //                 });
    //             })
    //             .catch(err => {
    //                 console.error('Error evaluating answers', err);
    //             });
    //     }
    // }, [currentIndex, subtitleLog, navigate]);

    useEffect(() => {
        const evaluateAndNavigate = async () => {
            // Prevent duplicate evaluations
            if (isEvaluating) return;
            setIsEvaluating(true);
            
            // Stop speech synthesis and recognition
            window.speechSynthesis.cancel();
            recognitionRef.current?.stop();
            
            // Collect Q&A pairs
            const qaPairs = [];
            let currentQuestion = null;

            subtitleLog.forEach(entry => {
                if (entry.who === 'AI') {
                    currentQuestion = entry.text;
                } else if (entry.who === 'You' && currentQuestion) {
                    qaPairs.push({
                        question: currentQuestion,
                        answer: entry.text
                    });
                    currentQuestion = null;
                }
            });

            if (qaPairs.length === 0) {
                console.error("No Q&A pairs to evaluate.");
                setIsEvaluating(false);
                return;
            }

            const resumeText = localStorage.getItem('resumeText');
            if (!resumeText) {
                console.error("Resume text not found in localStorage.");
                setIsEvaluating(false);
                return;
            }

            try {
                const res = await axios.post('http://localhost:5000/evaluate-resume-answers', {
                    resumeText,
                    answers: qaPairs
                });

                navigate('/resume-results', {
                    state: {
                        evaluationResult: res.data,
                        qaPairs
                    }
                });
            } catch (err) {
                console.error('Error evaluating answers', err);
                setIsEvaluating(false);
            }
        };

        // Add a small delay to ensure speech synthesis is complete
        if (currentIndex >= prefixedQuestions.length && subtitleLog.length > 0 && !isEvaluating) {
            const delay = isAISpeaking ? 1500 : 0; // Wait longer if AI is still speaking
            const timer = setTimeout(evaluateAndNavigate, delay);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, subtitleLog, navigate, isAISpeaking, isEvaluating]);

    return (
        <div className="interview-flex">
            {questions.length === 0 ? (
                <div>Loading interview...</div>
            ) : (
                <>

                    <div className="interview-main">
                        <div className="avatars">
                            <div className={`avatar-container ${isAISpeaking ? 'active-speaker' : ''}`}>
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                                    alt="AI"
                                    className="avatar"
                                />
                            </div>
                            <div className={`avatar-container ${isUserSpeaking ? 'active-speaker' : ''}`}>
                                {isCameraOn ? (
                                    <video ref={videoRef} autoPlay playsInline className="avatar webcam" />
                                ) : (
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                                        alt="User"
                                        className="avatar"
                                    />
                                )}
                            </div>
                        </div>

                        {showQuestion && (
                            <div className="question-card">
                                <h3>Question {currentIndex + 1}</h3>
                                <p>{prefixedQuestions[currentIndex]}</p>
                            </div>
                        )}

                        <div className="controls">
                            <button onClick={toggleMic} className="control-btn">
                                {isMicOn ? '🔴🎙️ Mic' : '🎙️ Mic'}
                            </button>
                            <button onClick={toggleCamera} className="control-btn">
                                {isCameraOn ? '🔴📷 Camera' : '📷 Camera'}
                            </button>
                            <button
                                onClick={() => setShowQuestion(!showQuestion)}
                                className="control-btn"
                            >
                                {showQuestion ? '❌ Hide Question' : '📄 Show Question'}
                            </button>
                            <button
                                onClick={() => setSubtitleOpen(!subtitleOpen)}
                                className="control-btn"
                            >
                                💬 {subtitleOpen ? 'Hide Subtitles' : 'Show Subtitles'}
                            </button>
                            <button onClick={endInterview} className="control-btn danger">
                                🛑 End Interview
                            </button>

                        </div>
                    </div>

                    {subtitleOpen && (
                        <div className="interview-subtitles">
                            <h4>Conversation Transcript</h4>
                            <div className="subtitle-log">
                                {subtitleLog.map((item, idx) => (
                                    <p key={idx} className={`subtitle-entry ${item.who.toLowerCase()}`}>
                                        <strong>{item.who}:</strong> {item.text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                </>
            )}
        </div>
    );
};

export default ResumeInterview;