"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/Gemini_Ai_model'
import { db } from '@/utils/db'
import { useAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs'

function RecordAnswerSection({ MockInterviewQuestion, activeQuestion, InterviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [Loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isFaceDetected, setIsFaceDetected] = useState(true);
  
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

  // Load Blazeface model when component mounts
  useEffect(() => {
    const loadModel = async () => {
      const blazefaceModel = await blazeface.load();
      setModel(blazefaceModel);
    };
    loadModel();
  }, []);

  // Detect face every second
  useEffect(() => {
    const detectFace = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        model
      ) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);

        if (predictions.length === 0) {
          // No face detected
          setIsFaceDetected(false);
          toast.error('No face detected. Please adjust your position.');
        } else {
          setIsFaceDetected(true);
        }
      }
    };

    const intervalId = setInterval(detectFace, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [model]);

  useEffect(() => {
    results.map((result) => {
      setUserAnswer(prevAns => prevAns + result?.transcript)
    })
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 5) {
      updateuserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateuserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackpromt = "Question : " + MockInterviewQuestion[activeQuestion].Question + 
      ", User Answer : " + userAnswer + 
      "Depends on Question and User Answer for given Interview Questions" + 
      " Please give a Rating for the Answer and Feedback as area of improvement in JSON format with Rating and feedback field";

    const result = await chatSession.sendMessage(feedbackpromt);
    const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    console.log(JsonFeedbackResp);

    const resp = await db.insert(useAnswer).values({
      mockIdRef: InterviewData?.mockId,
      question: MockInterviewQuestion[activeQuestion].Question,
      correctAns: MockInterviewQuestion[activeQuestion].Answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.Feedback,
      rating: JsonFeedbackResp?.Rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format('DD-MM-YYYY')
    });

    if (resp) {
      toast.success("User Answer Recorded Successfully");
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);
    setLoading(false);
  };

  return MockInterviewQuestion && (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5'>
        <Image src={'/Webcam.png'} width={200} height={200} className='absolute'></Image>
        <Webcam 
          ref={webcamRef} 
          style={{ height: 350, width: '100%', zIndex: 10 }} 
          mirrored={true} 
        />
      </div>
      <Button variant="outline" className="my-10" onClick={StartStopRecording} disabled={Loading}>
        {isRecording ? (
          <h2 className='flex gap-2 text-red-600 '>
            <Mic /> Stop Recording
          </h2>
        ) : "Record Answer"}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
