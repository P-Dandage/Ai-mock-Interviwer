"use client"
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Interviewcart from './Interviewcart';
import './InterviewList.css';

import { motion, AnimatePresence } from 'framer-motion';

function InterviewList() {
    const { user } = useUser();
    const [interviewlist, setInterviewlist] = useState([]);

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const results = await db
            .select()
            .from(mockInterview)
            .where(eq(mockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(mockInterview.id));

        setInterviewlist(results);
    };

    
    const containerVariants = {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,  
        },
      },
    };

 
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="interview-list-container">
            <h2 className="interview-list-title">Previous Mock Interviews</h2>
            <motion.div
              className="interview-list-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <AnimatePresence>
                {interviewlist &&
                    interviewlist.map((interview, index) => (
                        <motion.div key={interview.id} variants={itemVariants} exit={{opacity: 0}}>
                            <Interviewcart interview={interview} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default InterviewList;
