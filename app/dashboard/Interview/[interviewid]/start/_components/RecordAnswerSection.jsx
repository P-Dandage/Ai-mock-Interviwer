// "use client";
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import React, { useEffect, useState, useRef } from 'react';
// import Webcam from 'react-webcam';
// import useSpeechToText from 'react-hook-speech-to-text';
// import { Mic } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/Gemini_Ai_model';
// import { db } from '@/utils/db';
// import { useAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';
// import * as blazeface from '@tensorflow-models/blazeface';
// import * as tf from '@tensorflow/tfjs';

// function RecordAnswerSection({ MockInterviewQuestion, activeQuestion, InterviewData }) {
//   const [userAnswer, setUserAnswer] = useState('');
//   const { user } = useUser();
//   const [Loading, setLoading] = useState(false);
//   const webcamRef = useRef(null);
//   const [model, setModel] = useState(null);
//   const [isFaceDetected, setIsFaceDetected] = useState(true);

//   const { isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   // Load BlazeFace model on component mount
//   useEffect(() => {
//     const loadModel = async () => {
//       const blazefaceModel = await blazeface.load();
//       setModel(blazefaceModel);
//     };
//     loadModel();
//   }, []);

//   // Detect face every second
//   useEffect(() => {
//     const detectFace = async () => {
//       if (webcamRef.current?.video.readyState === 4 && model) {
//         const video = webcamRef.current.video;
//         const predictions = await model.estimateFaces(video);
//         setIsFaceDetected(predictions.length > 0);
//       }
//     };
//     const intervalId = setInterval(detectFace, 1000);
//     return () => clearInterval(intervalId);
//   }, [model]);

//   useEffect(() => {
//     setUserAnswer((prevAns) => prevAns + results.map((r) => r.transcript).join(' '));
//   }, [results]);

//   useEffect(() => {
//     if (!isRecording && userAnswer.length > 5) {
//       updateUserAnswer();
//     }
//   }, [userAnswer]);

//   const StartStopRecording = () => {
//     isRecording ? stopSpeechToText() : startSpeechToText();
//   };

//   const updateUserAnswer = async () => {
//     setLoading(true);
//     const feedbackPrompt = {
//       question: MockInterviewQuestion[activeQuestion].Question,
//       user_answer: userAnswer,
//       prompt: "Based on the question and user's answer, provide a rating (1-10) and structured feedback highlighting strengths and areas for improvement in JSON format."
//     };

//     try {
//       const result = await chatSession.sendMessage(JSON.stringify(feedbackPrompt));
//       const responseText = result.response.text().replace('```json', '').replace('```', '');
//       const feedbackJson = JSON.parse(responseText);
      
//       await db.insert(useAnswer).values({
//         mockIdRef: InterviewData?.mockId,
//         question: MockInterviewQuestion[activeQuestion].Question,
//         correctAns: MockInterviewQuestion[activeQuestion].Answer,
//         userAns: userAnswer,
//         feedback: JSON.stringify(feedbackJson.feedback),
//         rating: feedbackJson.rating,
//         userEmail: user.primaryEmailAddress.emailAddress,
//         createdAt: moment().format('DD-MM-YYYY'),
//       });

//       toast.success("User Answer Recorded Successfully!", { position: "top-center" });
//       setUserAnswer('');
//       setResults([]);
//     } catch (error) {
//       console.error("Error processing feedback:", error);
//       toast.error(" Failed to process feedback.");
//     }
//     setLoading(false);
//   };

//   return (
//     MockInterviewQuestion && (
//       <div className='flex items-center justify-center flex-col'>
//         <div className='flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5 relative'>
//           <Image src={'/Webcam.png'} width={200} height={200} className='absolute' alt='Webcam' />
//           <Webcam ref={webcamRef} style={{ height: 350, width: '100%', zIndex: 10 }} mirrored />
//           {!isFaceDetected && (
//             <div className='absolute top-0 left-0 right-0 bg-red-600 text-white text-center p-2'>
//               ❌ No face detected! Adjust your position.
//             </div>
//           )}
//         </div>
//         <Button variant='outline' className='my-10' onClick={StartStopRecording} disabled={Loading}>
//           {isRecording? (
//             <h2 className='flex gap-2 text-red-600'>
//               <Mic /> Stop Recording
//             </h2>
//           ) : (
//             "Record Answer"
//           )}
//         </Button>
//       </div>
//     )
//   );
// }

// export default RecordAnswerSection;
"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/Gemini_Ai_model';
import { db } from '@/utils/db';
import { useAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';

function RecordAnswerSection({ MockInterviewQuestion, activeQuestion, InterviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [Loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isFaceDetected, setIsFaceDetected] = useState(true);

  const { isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    lang: 'en-IN',  
  });

  // Load BlazeFace model on component mount
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
      if (webcamRef.current?.video.readyState === 4 && model) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);
        setIsFaceDetected(predictions.length > 0);
      }
    };
    const intervalId = setInterval(detectFace, 2000);
    return () => clearInterval(intervalId);
  }, [model]);

  // Append new speech transcripts to userAnswer
  useEffect(() => {
    setUserAnswer((prevAns) => prevAns + ' ' + results.map((r) => r.transcript).join(' '));
  }, [results]);

  // When recording stops and answer is longer than 5 characters, submit
  useEffect(() => {
    if (!isRecording && userAnswer.trim().length > 5) {
      updateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = () => {
    isRecording ? stopSpeechToText() : startSpeechToText();
  };

  const updateUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt = {
      question: MockInterviewQuestion[activeQuestion].Question,
      user_answer: userAnswer.trim(),
      prompt: "Based on the question and user's answer, provide a  rating (1-10) give rating as per keywords present in user answers or user answer reletaed to that topic that related to Question and structured feedback highlighting strengths and areas for improvement in JSON format."
    };

    try {
      const result = await chatSession.sendMessage(JSON.stringify(feedbackPrompt));
      const responseText = result.response.text().replace('```json', '').replace('```', '');
      const feedbackJson = JSON.parse(responseText);

      await db.insert(useAnswer).values({
        mockIdRef: InterviewData?.mockId,
        question: MockInterviewQuestion[activeQuestion].Question,
        correctAns: MockInterviewQuestion[activeQuestion].Answer,
        userAns: userAnswer.trim(),
        feedback: JSON.stringify(feedbackJson.feedback),
        rating: feedbackJson.rating,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      });

      toast.success("User Answer Recorded Successfully!", { position: "top-center" });
      setUserAnswer('');
      setResults([]);
    } catch (error) {
      console.error("Error processing feedback:", error);
      toast.error("Failed to process feedback.");
    }

    setLoading(false);
  };

  return (
    MockInterviewQuestion && (
      <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5 relative'>
          <Image src={'/Webcam.png'} width={200} height={200} className='absolute' alt='Webcam' />
          <Webcam ref={webcamRef} style={{ height: 350, width: '100%', zIndex: 10 }} mirrored />
          {!isFaceDetected && (
            <div className='absolute top-0 left-0 right-0 bg-red-600 text-white text-center p-2'>
              ❌ No face detected! Adjust your position.
            </div>
          )}
        </div>
        <Button variant='outline' className='my-10' onClick={StartStopRecording} disabled={Loading}>
          {isRecording ? (
            <h2 className='flex gap-2 text-red-600'>
              <Mic /> Stop Recording
            </h2>
          ) : (
            "Record Answer"
          )}
        </Button>
      </div>
    )
  );
}

export default RecordAnswerSection;
