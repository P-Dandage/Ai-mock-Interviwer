"use client";
import { db } from "@/utils/db";
import { useAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import "./Feedback.css";

// Helper: Progress Bar
const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
};

// Helper: Determine status
const getInterviewStatus = (rating) => {
  if (rating >= 7.5) return { status: "Pass", color: "green", chance: 90 };
  if (rating >= 5) return { status: "Moderate", color: "orange", chance: 60 };
  return { status: "Fail", color: "red", chance: 30 };
};

function Feedback({ params }) {
  const [feedbackList, setFeedbacklist] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState([]);
  const [showPrevious, setShowPrevious] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(useAnswer)
        .where(eq(useAnswer.mockIdRef, params.interviewid))
        .orderBy(useAnswer.id);

      setFeedbacklist(result);

      const latest = [];
      const seen = new Set();
      for (const item of result.reverse()) {
        if (!seen.has(item.question)) {
          seen.add(item.question);
          latest.push(item);
        }
      }
      setLatestFeedback(latest);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (data) => {
    const validRatings = data
      .map((item) => Number(item.rating) || 0)
      .filter((r) => r >= 0 && r <= 10);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
  };

  const displayedFeedback = showPrevious ? feedbackList : latestFeedback;

  // Calculate only from latestFeedback
  const latestRating = calculateAverageRating(latestFeedback);
  const { status, color, chance } = getInterviewStatus(latestRating);

  return (
    <div className="container">
      <div className="content-wrapper">
        {loading ? (
          <div className="loader-container">
            <div className="loader" />
          </div>
        ) : (
          <>
            {latestFeedback.length === 0 ? (
              <h2 className="no-feedback">No interview feedback records found.</h2>
            ) : (
              <>
                <div className="header-container-feedback">
                  <h2 className="main-heading">Congratulations!</h2>
                  <h3 className="sub-heading">Here's Your Interview Feedback</h3>
                </div>

                {/* Overall Rating */}
                <div className="rating-container">
                  <h2 className="rating-heading">
                    Your Overall Interview Rating:{" "}
                    <strong>{latestRating.toFixed(1)}/10</strong>
                  </h2>
                  <ProgressBar value={latestRating} max={10} />
                </div>

                {/* Status and Chance */}
                <div className="status-container">
                  <p className="interview-status">
                    Interview Status:{" "}
                    <span style={{ color, fontWeight: "600" }}>{status}</span>
                  </p>
                  <p className="chance-percentage">
                    Chance of Selection: <strong>{chance}%</strong>
                  </p>
                </div>

                {/* Feedback Section */}
                <div className="feedback-section">
                  <h3 className="section-heading">
                    {showPrevious
                      ? "All Responses (Previous & Latest)"
                      : "📌 Latest Responses"}
                  </h3>

                  {displayedFeedback.map((item, index) => (
                    <Collapsible key={index} className="feedback-item">
                      <CollapsibleTrigger className="feedback-question">
                        {"Q" + (index + 1) + ". " + item.question}
                        <ChevronsUpDown className="chevron-icon" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="feedback-details">
                          <div className="rating-box">
                            <strong className="detail-label">Rating: </strong>
                            <span className="rating-value">{item.rating} /10</span>
                          </div>
                          <div className="answer-box">
                            <strong className="detail-label">Your Answer: </strong>
                            <p className="answer-text">{item.userAns}</p>
                          </div>
                          <div className="correct-answer-box">
                            <strong className="detail-label">Correct Answer: </strong>
                            <p className="answer-text">{item.correctAns}</p>
                          </div>
                          <div className="feedback-box">
                            <strong className="detail-label">Feedback: </strong>
                            <div className="feedback-content">
                              {(() => {
                                try {
                                  const f = JSON.parse(item.feedback);
                                  return (
                                    <div className="feedback-content-1">
                                      <h4 className="feedback-category strengths">Strengths:</h4>
                                      <ul className="feedback-list">
                                        {f.strengths.map((point, i) => (
                                          <li key={i}>{point}</li>
                                        ))}
                                      </ul>
                                      <h4 className="feedback-category improvements">Areas for Improvement:</h4>
                                      <ul className="feedback-list">
                                        {f.areas_for_improvement.map((point, i) => (
                                          <li key={i}>{point}</li>
                                        ))}
                                      </ul>
                                      <h4 className="feedback-category suggestions">Suggestions:</h4>
                                      <ul className="feedback-list">
                                        {f.suggestions.map((point, i) => (
                                          <li key={i}>{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                } catch (error) {
                                  return <p>{item.feedback}</p>;
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </>
            )}

            {feedbackList.length > latestFeedback.length && (
              <div className="toggle-button-container">
                <Button onClick={() => setShowPrevious(!showPrevious)} className="toggle-button">
                  {showPrevious ? "Show Latest Responses Only" : " Show All Responses"}
                </Button>
              </div>
            )}

            <div className="home-button-container">
              <Button onClick={() => router.replace("/dashboard")} className="home-button">
                Go to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;