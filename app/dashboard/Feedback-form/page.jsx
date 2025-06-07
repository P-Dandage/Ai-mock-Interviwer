'use client';
import { useState, useEffect } from 'react';
import './Feedback-form.css';
import { saveFeedback, getAllFeedbacks } from '@/utils/feedbackActions';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({
    name: '',
    interviewTopic: '',
    email: '',
    feedbackText: '',
  });

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const all = await getAllFeedbacks();
        setFeedbacks(all.reverse()); // Keep original latest first
      } catch (error) {
        alert('Failed to load feedbacks');
      }
    }
    fetchFeedbacks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveFeedback(form);
      alert('Thank you for your feedback!');
      setForm({ name: '', interviewTopic: '', email: '', feedbackText: '' });
      const updated = await getAllFeedbacks();
      setFeedbacks(updated.reverse());
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div className="container">
      <h2>
        What Our <span>Users Say</span>
      </h2>

      <div className="slider-wrapper">
        <div className="testimonial-slider">
          {[...feedbacks, ...feedbacks].map((fb, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="testimonial-header">
                <img src="/person.png" alt={`${fb.name}'s photo`} />
                <div className="user-info">
                  <h4>{fb.name}</h4>
                  <div className="tag">{fb.interviewTopic}</div>
                </div>
              </div>
              <div className="testimonial-text">"{fb.feedbackText}"</div>
              <div className="testimonial-footer">
                <div className="footer-info">
                  <div>
                    <div className="footer-name">{fb.name}</div>
                    <div className="footer-role">{fb.email}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feedback-head">
        <h2>
          Tell Us What <span>You Think</span>
        </h2>
        <h3>Honest feedback lights the way to improvement</h3>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h3>Leave Your Feedback</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <input
          name="interviewTopic"
          value={form.interviewTopic}
          onChange={handleChange}
          placeholder="Interview Topic"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <textarea
          name="feedbackText"
          value={form.feedbackText}
          onChange={handleChange}
          placeholder="Your Feedback"
          required
        />
        <button type="submit">Submit Feedback</button>
      </form>

      <div className="feedback-note">
  <p>
    We truly value every piece of feedback from our users. Your honest opinions
    help us improve and create a better experience for everyone. Whether it’s praise,
    suggestions, or constructive criticism, we are eager to hear from you. Thank you
    for taking the time to share your thoughts with us!
  </p>
</div>
    </div>
  );
}
