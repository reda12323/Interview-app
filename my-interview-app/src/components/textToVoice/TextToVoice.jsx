import React, { useState, useEffect } from 'react';

const TextToVoice = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  // These are the exact voice names you want to show
  const allowedVoices = [
    "Microsoft EmmaMultilingual Online (Natural) - English (United States)",
    "Microsoft BrianMultilingual Online (Natural) - English (United States)"
  ];

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const filtered = allVoices.filter(voice => allowedVoices.includes(voice.name));
      setVoices(filtered);
      if (filtered.length > 0 && !selectedVoice) {
        setSelectedVoice(filtered[0].name);
      }
    };

    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const speak = () => {
    if (!text.trim()) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    synth.cancel();
    synth.speak(utterance);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>Text to Voice</h2>

      <textarea
        rows="5"
        cols="50"
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label>Select Voice: </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((voice, i) => (
            <option key={i} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <button onClick={speak}>🔊 Read Aloud</button>
    </div>
  );
};

export default TextToVoice;
