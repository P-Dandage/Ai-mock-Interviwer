"use client";
import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-container">
      <section className="section intro">
        <h1>How AI <span>MockInterview</span> Works</h1>
        <p>
          Our AI-based Mock Interview Evaluator offers a smart, interactive, and fully automated platform 
          designed for students and job seekers to sharpen their interview skills.
          <br /><br />
          Unlike traditional mock interviews that depend on human evaluators, our system uses artificial intelligence to provide 
          personalized, unbiased, and real-time feedback — anytime, anywhere.
          <br /><br />
          You’ll get role-specific questions based on your academic background and career goals. 
          With voice-based answering and webcam analysis, it evaluates your performance based on:
         
          <br />
          After each session, you receive a detailed performance report including scores, suggestions, and confidence insights — 
          helping you track your progress and improve over time.
          <br /><br />
          Whether you’re a student, job aspirant, or trainer, this web-based tool brings structure, objectivity, and AI-powered analytics 
          to your interview journey.
        </p>
      </section>

      <section className="section">
        <h2>📌 Step-by-Step Process</h2>
        <ol>
          <li><strong>1. Login:</strong> Sign in securely using Clerk authentication.</li>
          <li><strong>2. Select Interview:</strong> Choose from multiple categories or difficulty levels.</li>
          <li><strong>3. Record Answer:</strong> Speak your answer, captured via webcam and mic.</li>
          <li><strong>4. Real-time Analysis:</strong> System evaluates your confidence through facial, speech, and text cues.</li>
          <li><strong>5. Get Feedback:</strong> Instant AI-generated rating and feedback for each question.</li>
          <li><strong>6. Track Progress:</strong> View past interviews and monitor your improvement.</li>
        </ol>
      </section>

      <section className="section">
        <h2>🌟 Why Use This Platform?</h2>
        <ul>
          <li><span>1. Practice Real Interview Questions:</span> Get commonly asked questions based on your domain or job role.</li>
          <li><span>2. Answer by Speaking:</span> No need to type! Just speak your answer, and the system will convert your voice into text.</li>
          <li><span>3. Webcam Confidence Detection:</span> Helps you practice maintaining eye contact and posture, just like a real interview.</li>
          <li><span>4. Instant Feedback:</span> After your answer, the AI gives:
            <ul>
              <li>✅ Score out of 10</li>
              <li>💡 Feedback: what you did well and what needs improvement</li>
            </ul>
          </li>
          <li><span>5. Saves Time:</span> Save time and effort for both learners and mentors.</li>
          <li><span>6. Track Your Progress:</span> Your answers and scores are saved so you can see improvement.</li>
        </ul>
      </section>
    </div>
  );
};

export default HowItWorks;
