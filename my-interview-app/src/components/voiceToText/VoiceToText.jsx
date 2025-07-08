import React, { useEffect, useRef, useState } from 'react';

const VoiceToText = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return (
    <div>
      <h2>Native Web Speech API Demo</h2>
      <p>Status: {listening ? '🎙️ Listening...' : '🛑 Stopped'}</p>
      <button onClick={startListening} disabled={listening}>Start</button>
      <button onClick={stopListening} disabled={!listening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
};

export default VoiceToText;
