"use client"
import { db } from '@/utils/db'
import { useAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function Feedback({ params }) {
  const [feedbackList, setFeedbacklist] = useState();
 const router=useRouter();
  useEffect(() => {
    getFeedback();
    }, [])

    useEffect(() => {
      if (feedbackList) {
        console.log("Feedback list ", feedbackList);
        
      }
    }, [feedbackList]);


  const getFeedback = async () => {
    const result = await db.select().from(useAnswer).where(eq(useAnswer.mockIdRef, params.interviewid)).orderBy(useAnswer.id);
    setFeedbacklist(result);
      
  }

  return feedbackList&&(
    <div className='p-10'>
      {feedbackList.length==0?
       <h2 className='font-bold text-xl text-gray-500'>No interview Feedback Record is Found </h2>:<>
      <h2 className='font-bold text-3xl text-green-600'> Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>

      
      <h2 className='text-yellow-400 text-lg my- 3'>Your Overall Interview Rating :<strong>7/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Find Below Interview Question with Correct answer, Your Answer and feedback for Improvement</h2>
      {feedbackList&&feedbackList.map((item,index)=>(
        <Collapsible key={index } className='mt-7'>
            <CollapsibleTrigger  className=' flex justify-between p-2 bg-secondary rounded-lg my-2 text-left gap-7 w-full'>
              {'Q'+(index+1)+"."}{item.question}<ChevronsUpDown className='h-5 w-5'></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent>
             <div className='flex flex-col gap-2'>
              <h2 className='text-red-500 border-2 rounded-lg '><strong>Rating : </strong>{item.rating}</h2>
              <h2 className="bg-red-50 text-sm text-red-900 border-2 rounded-lg " ><strong>Your Answer : </strong>{item.userAns}</h2>
              <h2 className="bg-green-50 text-sm text-green-900 border-2 rounded-lg " ><strong>Correct Answer : </strong>{item.correctAns}</h2>
              <h2 className="bg-blue-50 text-sm text-blue-900 border-2 rounded-lg " ><strong>Feedback: </strong>{item.feedback}</h2>

              </div>
            </CollapsibleContent>
      </Collapsible>

      ))}
      </>}
      <Button onClick={()=>router.replace('/dashboard')}>Go TO Home</Button>
    
     
     
    </div>
  )
}

export default Feedback
