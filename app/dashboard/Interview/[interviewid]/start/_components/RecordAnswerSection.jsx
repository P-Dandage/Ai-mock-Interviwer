"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/Gemini_Ai_model";
import { db } from "@/utils/db";
import { useAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import * as faceapi from "face-api.js";

function RecordAnswerSection({ MockInterviewQuestion, activeQuestion, InterviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [Loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(true);
  const [emotion, setEmotion] = useState("Neutral");
  const [confidence, setConfidence] = useState(0);

  const {
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
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
        ]);
        console.log("✅ FaceAPI models loaded successfully!");
      } catch (error) {
        console.error("❌ Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const detectFaceAndEmotion = async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;

        try {
          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (!detection) {
            setIsFaceDetected(false);
            setEmotion("Neutral");
            setConfidence(0);
            toast.error("No face detected! Please adjust your position.", { position: "top-center", duration: 3000 });
            return;
          }

          setIsFaceDetected(true);

          const detectedEmotions = detection.expressions;
          const maxEmotion = Object.keys(detectedEmotions).reduce((a, b) =>
            detectedEmotions[a] > detectedEmotions[b] ? a : b
          );
          const maxEmotionConfidence = detectedEmotions[maxEmotion];

          const faceConfidence = detection.detection.score;
          const finalConfidence = ((faceConfidence + maxEmotionConfidence) / 2) * 100;

          setEmotion(maxEmotion);
          setConfidence(finalConfidence.toFixed(2));
        } catch (error) {
          console.error("❌ Error detecting face/emotions:", error);
        }
      }
    };

    const intervalId = setInterval(detectFaceAndEmotion, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 5) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${MockInterviewQuestion[activeQuestion].Question}, 
      User Answer: ${userAnswer}.
      Based on the question and user's answer, provide a rating and feedback 
      in JSON format with 'Rating' and 'Feedback' fields.`;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response.text().replace("```json", "").replace("```", "");
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
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast.success("✅ User Answer Recorded Successfully!", { position: "top-center" });
      setUserAnswer("");
      setResults([]);
    }
    setLoading(false);
  };

  return (
    MockInterviewQuestion && (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5 relative">
          <Image src={"/Webcam.png"} width={200} height={200} className="absolute" alt="Webcam" />
          <Webcam ref={webcamRef} style={{ height: 350, width: "100%", zIndex: 10 }} mirrored={true} />
          
          <p className="text-white mt-3 text-lg">
            Emotion: <b className="text-red-500">{emotion}</b>
          </p>
          <p className="text-white mt-1 text-lg">
            Confidence: <b className="text-green-500">{confidence}%</b>
          </p>

          {!isFaceDetected && (
            <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center p-2">
              ❌ No face detected! Adjust your position.
            </div>
          )}
        </div>
        
        <Button variant="outline" className="my-10" onClick={StartStopRecording} disabled={Loading}>
          {isRecording ? (
            <h2 className="flex gap-2 text-red-600">
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
