import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddnewInterview from './_components/AddnewInterview'
import InterviewList from './_components/InterviewList'

function dashboard() {
  return (
    <div className='p-10 '>
    <h2 className='font-bold  text-2xl '>DashBoard </h2>
    <h2 className='text-gray-500'>Create and Start Your AI mockup Interview </h2>
    <div className=' grid grid-cols-1 md:grid-cols-3 my-5'>
      <AddnewInterview></AddnewInterview>
    </div>

    {/* Previous Interview List  */}
    <InterviewList></InterviewList>
    </div>
  )
}

export default dashboard
