"use client";
import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-container">
    <section className="section intro">
  <h1>How AI <span> MockInterview</span> Works </h1>
  <p>
    Our AI-based Mock Interview Evaluator offers a smart, interactive, and fully automated platform 
    tailored for students and job seekers to sharpen their interview skills. Unlike traditional methods 
    that depend on human evaluators, this system leverages artificial intelligence to provide 
    personalized, unbiased, and real-time feedback.
    <br /><br />
    The platform dynamically generates role-specific questions based on your academic background and career goals. 
    With voice-based answering and webcam analysis, it evaluates your performance through speech clarity, facial expressions, 
    confidence, and answer relevance—offering a real-world interview simulation experience.
    <br /><br />
    After each session, users receive a detailed performance report including scores, suggestions, and confidence insights, 
    helping them identify strengths and areas of improvement. Progress is tracked over time, allowing repeated practice and self-evaluation.
    <br /><br />
    This web-based tool is accessible anytime, anywhere, making interview preparation flexible, effective, and secure. 
    Whether you're a student, job aspirant, or part of a training institute, the AI Mock Interview Evaluator brings structure, objectivity, 
    and smart analytics to your interview journey.
  </p>
</section>


      <section className="section">
        <h2>Step-by-Step Process</h2>
        <ol>
          <li><strong>1. Login:</strong> Sign in securely using Clerk authentication.</li>
          <li><strong>2. Select Interview:</strong> Choose from multiple categories or difficulty levels.</li>
          <li><strong>3. Record Answer:</strong> Speak your answer, captured via webcam and mic.</li>
          <li><strong>4. Real-time Analysis:</strong> System evaluates your confidence through facial, speech, and text cues.</li>
          <li><strong>5. Get Feedback:</strong> Instant AI-generated rating and feedback for each question.</li>
          <li><strong>6. Track Progress:</strong> View past interviews and monitor your improvement.</li>
        </ol>
      </section>

      <section className="section ">
        <h2>Why Use This Platform?</h2>
        <ul>
          <li> <span>1. Practice Real Interview Questions : </span>Get commonly asked questions based on your domain or job role.</li>
          <li> <span>2. Answer by Speaking :</span> No need to type! Just speak your answer, and the system will convert your voice into text.</li>
          <li> <span>3.Webcam Confidence Detection :</span> Helps you practice maintaining eye contact and posture, just like a real interview.

</li>
          <li><span>4. Instant Feedback :</span>  After your answer, the AI gives:A score out of 10 Feedback like what you did well and what needs improvement</li>
            <li><span>6.Track Your Progress:</span>  Your answers and scores are saved</li> 
            <li><span> 5.Saves time :</span> Save Time and effort for both learners and mentors</li>
       
        </ul>
      </section>
    </div>
  );
};

export default HowItWorks;
