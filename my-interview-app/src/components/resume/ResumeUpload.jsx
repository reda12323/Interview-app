import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './resumeUpload.css';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid || localStorage.getItem('uid');


  const handleUpload = async () => {
  if (!file) return;
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('uid', uid);

  try {
    const res = await axios.post('http://localhost:5000/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { sessionId, resumeText } = res.data;

    // Save resumeText to localStorage here:
    localStorage.setItem('resumeText', resumeText);

    navigate(`/resume-interview/${sessionId}`);
  } catch (err) {
    console.error('Upload failed', err);
  }
};


  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="resume-container">
      <h1 className="resume-title">Upload Your Resume</h1>
      <p className="resume-subtitle">
        Upload your resume (PDF or DOCX), and the AI will generate interview questions based on it.
      </p>

      <div className="resume-card">
        <h2 className="section-title">Resume Upload</h2>
        <p className="section-subtitle">Select your resume file to get started.</p>

        <label htmlFor="file-upload" className="custom-file-upload">
          {file ? file.name : "Choose a file"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="button-row">
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Submit Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
