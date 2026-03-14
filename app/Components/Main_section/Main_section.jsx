import React from 'react'
import './Main_section.css'
import Link from "next/link";

const Main_section = () => {
  return (
    <div className='main_section'>
    
        <h1> Ace Every <span> Interview <br></br>with <br></br>AI-Powered</span> Performance Evaluation!  </h1>
        <p>Analyze interview performance in real time with AI to gain insights, refine skills, and boost confidence.</p>
        <div className=' main_2'>
        <Link href={'/dashboard'}>  <button className='start'> Get Started </button></Link>
            <button className='about'> About us</button>

        </div>
    </div>
  )
}

export default Main_section
