
import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react'

function QuestionSections({MockInterviewQuestion,activeQuestion,setActiveQuestion}) {
  
 
  const handleSpeakQuestion = () => {
    texttospeech(MockInterviewQuestion[activeQuestion].Question);
    
  };
  const texttospeech = (text) => {
    
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0; 
      speech.pitch = 1.0; 
      speech.volume = 1.0; 
  
      speech.onend = () => {
        console.log('Speech synthesis finished');
       
      };
  
      speech.onerror = (error) => {
        console.error('Speech synthesis error:', error);
       
      };
  
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text-to-speech');
    }
  };
    return MockInterviewQuestion&&(
        <div className='p-5 border rounded-lg my-10'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
            {MockInterviewQuestion && MockInterviewQuestion.map((question, index) => (
        <h2 className={`'h-3 p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer' ${activeQuestion==index && 'bg-slate-950 text-white'}`} key={index} onClick={()=>{setActiveQuestion(index)}}  >Question #{index+1}</h2>
            ))}
          </div> 
        
         <h2 className='my-5 text-md md:text-lg' >{MockInterviewQuestion[activeQuestion].Question} </h2>  
          <Volume2 className=" cursor-pointer hover:scale-150" onClick={handleSpeakQuestion}></Volume2> 
          <div className=' border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 item-center text-blue-700 '>
              <Lightbulb/>
              <strong>Note : </strong>
            </h2>
            <h2 className='text-sm text-blue-700 my-3'>
            Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to comapre it
            </h2>
          </div>
        </div>
      );
}

export default QuestionSections
