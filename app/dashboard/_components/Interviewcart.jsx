import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import './Interviewcart.css';

function Interviewcart({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push('/dashboard/Interview/' + interview?.mockId);
  };

  const onFeedback = () => {
    router.push('/dashboard/Interview/' + interview?.mockId + "/Feedback");
  };

  return (
    <div className="interview-card">
      <h2 className="interview-title">{interview?.jobPosition}</h2>
      <h2 className="interview-experience">{interview?.jobExperience} Years of Experience</h2>
      <h2 className="interview-date">Created At: {interview.createdAt}</h2>
      
      <div className="button-container"> 
               <Button size="sm" className="custom-button_1" onClick={onStart}>Start</Button>
               <Button size="sm" className="custom-button_2" onClick={onFeedback}>Feedback</Button>
      </div>
    </div>
  );
}

export default Interviewcart;
