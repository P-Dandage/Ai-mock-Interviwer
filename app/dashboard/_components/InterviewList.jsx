"use client"
import { db } from '@/utils/db';
import { mockInterview, useAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import Interviewcart from './Interviewcart';



function InterviewList() {
    const {user}=useUser();
    const [interviewlist,setInterviewlist]=useState();

    useEffect(()=>{
        user&&GetInterviewList();
    },[user])

    useEffect(()=>{
        if(interviewlist)
            console.log("Interview : "+interviewlist[0].createdBy);

    },[interviewlist])

    const GetInterviewList=async()=>{
        const results=await db.select().from(mockInterview).where(eq(mockInterview.createdBy,user?.primaryEmailAddress?.emailAddress )).orderBy(desc(mockInterview.id))
        setInterviewlist(results);
        console.log(results);
        
    }
  return(
    <div >
      <h2 className=' font-medium text-xl '>Privious Mock Interviews</h2>
      <div className='gap-5 my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '>
        
        {interviewlist&&interviewlist.map((interview,index)=>(
            
           <Interviewcart interview={interview}key={index} ></Interviewcart>
              
        ))}
      </div>
    </div>
  )
}

export default InterviewList
