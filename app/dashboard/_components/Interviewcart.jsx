
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function Interviewcart({interview}) {
  const router=useRouter();
  const onStart=()=>{
    router.push('/dashboard/Interview/'+interview?.mockId)

  }
  const onFeedback=()=>{
    router.push('/dashboard/Interview/'+interview?.mockId+"/Feedback")
  }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold '>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-gray-400'>Created At :{interview.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5  '>
           <Button size='sm' variant='outline' className="w-full" onClick={onFeedback}> Feedback</Button>
          
             <Button size='sm'className="w-full"onClick={onStart} >Start</Button>
         
        </div>
    </div>
  )
}

export default Interviewcart
