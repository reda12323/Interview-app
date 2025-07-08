import React, { useEffect } from "react";
import { auth, signInWithGoogle, signInWithGithub, signInWithFacebook } from "./firebase";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebookF } from 'react-icons/fa';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



const Auth = () => {
    const navigate = useNavigate(); // ✅

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const { uid, email, displayName, photoURL, providerData } = user;
                const provider = providerData.length > 0 ? providerData[0].providerId : "unknown";

                try {
                    const response = await fetch("http://localhost:5000/api/firebaseAuth", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid, email, displayName, photoURL, provider }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to send user data to backend");
                    }

                    const data = await response.json();
                    console.log("User data saved:", data);

                    // ✅ Redirect after successful login and backend sync
                    navigate("/paste-job", {
                        state: {
                            uid,
                            email,
                            displayName,
                            photoURL,
                            provider,
                        },
                    });
                    localStorage.setItem('uid', uid);


                } catch (error) {
                    console.error("Error sending user data to backend:", error);
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Welcome</h2>
                <p>Sign in with one of the following providers:</p>

                <button className="auth-button google" onClick={signInWithGoogle}>
                    <FcGoogle size={20} className="auth-icon" />
                    Continue with Google
                </button>

                <button className="auth-button github" onClick={signInWithGithub}>
                    <FaGithub size={18} className="auth-icon" />
                    Continue with GitHub
                </button>

                <button className="auth-button facebook" onClick={signInWithFacebook}>
                    <FaFacebookF size={18} className="auth-icon" />
                    Continue with Facebook
                </button>
            </div>
        </div>
    );
};

export default Auth;
