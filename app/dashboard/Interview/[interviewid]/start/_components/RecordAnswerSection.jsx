"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/Gemini_Ai_model'
import { db } from '@/utils/db'
import { useAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'

function RecordAnswerSection({ MockInterviewQuestion, activeQuestion, InterviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [Loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer(prevAns => prevAns + result?.transcript)
    })

  }, [results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>5)
    {
      updateuserAnswer();
    }

  },[userAnswer])


  const StartStopRecording = async () => {
    if (isRecording) {
          stopSpeechToText()
          // if (userAnswer?.length < 3) {
          //   setLoading(false);
          //   toast("Error while saving your answer, Please record again");
          //   return;
          //     } 
            } else {
              startSpeechToText()
             }

  }
  const updateuserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackpromt = "Question : " + MockInterviewQuestion[activeQuestion].Question + ", User Answer : " + userAnswer + "Depends on Question and User Answer for given Interview Questions" + " Plaease gives a Rating for Answer and Feedback as area of improvment if any " + "In just 3-5 line to improve it in JSON format with Rating and feedback field";
    const result = await chatSession.sendMessage(feedbackpromt)
    const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
      console.log(JsonFeedbackResp);
    const resp = await db.insert(useAnswer).values({
      mockIdRef: InterviewData?.mockId,
      question:MockInterviewQuestion[activeQuestion].Question ,
      correctAns: MockInterviewQuestion[activeQuestion].Answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.Feedback,
      rating: JsonFeedbackResp?.Rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format('DD-MM-YYYY')
    })
    if (resp) {
      toast("User Answer Recorded Succesfully ");
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);
   
    setLoading(false);
  
  }


  return MockInterviewQuestion&& (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5'>
        <Image src={'/Webcam.png'} width={200} height={200} className='absolute'></Image>
        <Webcam style={{ height: 350, width: '100%', zIndex: 10, }} mirrored={true}></Webcam>
      </div>
      <Button variant="outline" className="my-10" onClick={StartStopRecording} disabled={Loading}>
        {isRecording ? <>
          <h2 className='flex gap-2 text-red-600 '>
            <Mic />Stop Recording
          </h2></> : "Record Answer"}</Button>
      
    </div>
  )
}

export default RecordAnswerSection
