"use client"
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionSections from './_components/QuestionSections';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {
  const [InterviewData, setInterviewData] = useState();
  const [MockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestion, setActiveQuestion] = useState(0);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  useEffect(() => {
    if (MockInterviewQuestion) {
      console.log("MockInterviewQuestion is ready:", MockInterviewQuestion);
    }
  }, [MockInterviewQuestion]);

  const getInterviewDetails = async () => {
    try {
      const results = await db.select().from(mockInterview).where(eq(mockInterview.mockId, params.interviewid));

      if (!results || results.length === 0) {
        console.error("No interview found for mockId:", params.interviewid);
        return;
      }

      let rawJson = results[0].jsonMockResp;

      // Sanitize string: replace unescaped newlines, tabs, carriage returns
      rawJson = rawJson.replace(/[\n\r\t]/g, " ");

      // Parse safely
      let jsonResp;
      try {
        jsonResp = JSON.parse(rawJson);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
        // fallback: try to eval as last resort (not ideal, only if JSON is almost valid)
        // jsonResp = eval("(" + rawJson + ")");
        jsonResp = []; // empty array to prevent crash
      }

      setMockInterviewQuestion(jsonResp);
      setInterviewData(results[0]);
    } catch (err) {
      console.error("Error fetching interview details:", err);
    }
  }

  if (!MockInterviewQuestion) return <div>Loading...</div>;

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        {/* Questions */}
        <QuestionSections
          MockInterviewQuestion={MockInterviewQuestion}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />

        {/* Videos/audio recording */}
        <RecordAnswerSection
          MockInterviewQuestion={MockInterviewQuestion}
          activeQuestion={activeQuestion}
          InterviewData={InterviewData}
        />

      </div>

      <div className='flex flex-row justify-end gap-10 mb-6'>
        {activeQuestion > 0 &&
          <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>Previous Question</Button>
        }

        {activeQuestion != MockInterviewQuestion.length - 1 &&
          <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>Next Question</Button>
        }

        {activeQuestion == MockInterviewQuestion.length - 1 &&
          <Link href={'/dashboard/Interview/' + InterviewData.mockId + '/Feedback'}>
            <Button>End Interview</Button>
          </Link>
        }
      </div>
    </div>
  )
}

export default StartInterview;