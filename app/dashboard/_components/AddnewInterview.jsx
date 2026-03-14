"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { chatSession } from '@/utils/Gemini_Ai_model';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import './AddnewInterview.css'

function AddnewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResp, setJsonResp] = useState([]);
    const { user } = useUser();

    const router=useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()
        const inputPrompt = `Job Position: ${jobPosition} Job Description: ${jobDesc} Years of Experience: ${jobExperience} Depends on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview question with Answered in Json Format, Give Question and Answered as field in JSON Only no extra text`;
        const result = await chatSession.sendMessage(inputPrompt)
        const mockJsonResp = await result.response.text().replace('```json', '').replace('```', '');
        setJsonResp(mockJsonResp);
        console.log(mockJsonResp);

        if (mockJsonResp) {
            const resp = await db.insert(mockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: mockJsonResp,
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                }).returning({ mockId: mockInterview.mockId })
            console.log("Inerted ID", resp)
               if (resp) {
                setOpenDialog(false);
                router.push('/dashboard/Interview/'+resp[0].mockId);
                  }
        } else {
            console.log("Error");
        }

        setLoading(false);
    }
    return (
        <div>
            <div className=' p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}>
                <h2 className=' text-lg text-center' >+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about<span> your job interview</span></DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="form-container">
                  <h2>Add details about your job position, description & experience</h2>
                  <div className="input-group">
                    <label>Job Role/Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(event) => setJobPosition(event.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea placeholder="React, NodeJs, Java, C" required onChange={(event) => setJobDesc(event.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 5" type="number" required onChange={(event) => setJobExperience(event.target.value)} />
                  </div>
                </div>

                <div className="button-group">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading} className="start">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating From AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


        </div>
    )
}

export default AddnewInterview
