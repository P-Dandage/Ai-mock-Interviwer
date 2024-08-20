"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';

function Interview({params}) {
     const [interviewdata,setInterviewData]=useState();
    const [webcamEnable,setWebcamEnable]=useState(false);
    useEffect(()=>{
        getInterviewDetails();
    },[])

    const getInterviewDetails=async()=>{
        const results= await db.select().from(mockInterview).where(eq(mockInterview.mockId,params.interviewid ))
        setInterviewData(results[0]);
      
    }
  return (
    <div className='my-10 '>
        <div className='flex justify-center items-center'>
            <h2 className='font-bold text-2xl'>Let's get Started </h2>
        </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

      <div className='flex flex-col my-5 gap-5'>
        <div className='flex flex-col p-5 rounded-lg border gap-5'>
        <h2 className='text-lg'><strong>Job Role/job Position :</strong>{interviewdata ? interviewdata.jobPosition : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Job Description/Tech Stack :</strong>{interviewdata ? interviewdata.jobDesc : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Years of Experience :</strong>{interviewdata ? interviewdata.jobExperirnce : 'Loading...'}</h2>
      </div>
      <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
        <h2 className='flex gap-2 items-center text-yellow-500 '><Lightbulb></Lightbulb><strong>information</strong></h2>
        <h2 className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your Al Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer NOTE: We never record your video, Web cam access you can disable at any time if you want</h2>
     </div>
      </div>
      <div>
        {webcamEnable? <Webcam 
         mirrored={true }
        onUserMedia={()=>{
            setWebcamEnable(true)
        }} onUserMediaError={()=>{setWebcamEnable(false)}}
        style={{height:350, width:500}} />
        :<><WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg boarder'></WebcamIcon>
          <Button variant="ghost"  onClick={()=>setWebcamEnable(true)} className='w-full'> Enable Webcam and Microphone</Button>
        </>
        }
      </div> 

      </div>
      <div className='flex justify-end items-end'>
        <Link href={'/dashboard/Interview/'+params.interviewid+'/start'}>
        <Button> Start Interview</Button>
        </Link>
      </div>
     
    </div>
  )
}

export default Interview
