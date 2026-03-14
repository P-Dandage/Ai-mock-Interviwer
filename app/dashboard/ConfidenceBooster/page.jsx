"use client";
import React, { useState, useEffect } from "react";
import "./ConfidenceBooster.css";

const quotes = [
  "Believe in yourself and all that you are.",
  "Confidence comes not from always being right but from not fearing to be wrong.",
  "You are capable of amazing things.",
  "The only limit to your impact is your imagination and commitment.",
  "Every interview is a learning opportunity."
];

const mindfulnessPrompts = [
  "Close your eyes for 2 minutes. Imagine yourself walking confidently into the interview room.",
  "Visualize answering questions with calmness and clarity.",
  "Take deep breaths and focus on the present moment — let go of future worries.",
  "Recall a proud achievement. Let that positive energy guide your mindset.",
  "Imagine your success — your name on the offer letter!"
];

const breathingSteps = [
  { text: "Breathe in slowly through your nose", duration: 4 },
  { text: "Hold your breath", duration: 7 },
  { text: "Exhale slowly through your mouth", duration: 8 }
];

export default function ConfidenceBooster() {
  const [quote, setQuote] = useState("");
  const [prompt, setPrompt] = useState("");
  const [breathStep, setBreathStep] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const total = 3;

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setPrompt(mindfulnessPrompts[Math.floor(Math.random() * mindfulnessPrompts.length)]);
  }, []);

const totalCycles = 1; // run only one cycle

useEffect(() => {
  let interval;
  if (breathing && cycleCount < totalCycles) {
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          if (breathStep < breathingSteps.length - 1) {
            const nextStep = breathStep + 1;
            setBreathStep(nextStep);
            return breathingSteps[nextStep].duration;
          } else {
            // finished all steps in the cycle
            if (cycleCount + 1 < totalCycles) {
              setCycleCount(count => count + 1);
              setBreathStep(0);
              return breathingSteps[0].duration;
            } else {
              // finished the only cycle, stop breathing
              setBreathing(false);
              clearInterval(interval);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(interval);
}, [breathing, breathStep, cycleCount]);


  const startBreathing = () => {
    setBreathing(true);
    setBreathStep(0);
    setTimer(breathingSteps[0].duration);
    setCycleCount(0);
  };

  return (
    <div className="confidence-booster-container">
      <h1 className="cb-heading">Confidence <span>Booster</span></h1>

      {/* Motivational Quote */}
      <section className="cb-section">
        <h2>Today's Motivational Quote</h2>
        <p className="cb-quote">"{quote}"</p>
        <button
          className="cb-button"
          onClick={() =>
            setQuote(quotes[Math.floor(Math.random() * quotes.length)])
          }
        >
          New Quote
        </button>
      </section>

      {/* Breathing Exercise */}
      <section className="cb-section">
        <h2 >Guided  <span>Breathing Exercise</span></h2>
        {!breathing ? (
          <button onClick={startBreathing} className="cb-button">
            Start Breathing Exercise
          </button>
        ) : cycleCount < totalCycles ? (
          <>
            <p className="cb-breath-step">{breathingSteps[breathStep].text}</p>
            <p className="cb-timer">{timer} seconds</p>
            {/* <p>Cycle: {cycleCount + 1} / {total}</p> */}
          </>
        ) : (
          <p className="cb-breath-step">✅ Breathing exercise complete!</p>
        )}
      </section>

      {/* Mindfulness Session */}
      <section className="cb-section">
        <h2>Mini Mindfulness Session</h2>
        <p className="cb-quote">{prompt}</p>
        <button
          className="cb-button"
          onClick={() =>
            setPrompt(
              mindfulnessPrompts[Math.floor(Math.random() * mindfulnessPrompts.length)]
            )
          }
        >
          New Prompt
        </button>
      </section>
    </div>
  );
}
