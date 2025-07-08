import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { auth } from '../authentification/firebase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(
    'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
  );
  const profileRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid || localStorage.getItem('uid');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(prev => !prev);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      fetch(`http://localhost:5000/api/profile-picture/${storedUid}`)
        .then(res => res.ok ? res.json() : { photoURL: profileImgUrl })
        .then(data => setProfileImgUrl(data.photoURL))
        .catch(() => setProfileImgUrl(profileImgUrl));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // ✅ logout from Firebase
      localStorage.removeItem("uid"); // ✅ clear local storage
      navigate("/login", { replace: true }); // ✅ send to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1 className="header-title">AI Interview Simulator</h1>
          <p className="header-subtitle">Practice your interview skills with AI feedback</p>
        </div>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <div className={`navbar-links-container ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
          <nav className="navbar-links">
            <Link to="/paste-job" className={`nav-link ${location.pathname === "/paste-job" ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>Paste Job Details</Link>
            <Link to="/resume-upload" className={`nav-link ${location.pathname === "/resume-upload" ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>Use Resume</Link>
            <Link to="/interview-question" className={`nav-link ${location.pathname === "/interview-question" ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>Interview & Questions</Link>
          </nav>
        </div>

        <div className={`navbar-profile-container ${isMenuOpen ? 'mobile-menu-open' : ''}`} ref={profileRef}>
          <div className="navbar-profile" onClick={toggleProfileDropdown}>
            <img src={profileImgUrl} alt="Profile" className="profile-img" />
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
