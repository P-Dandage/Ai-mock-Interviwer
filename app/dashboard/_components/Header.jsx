"use client"
import { UserButton } from '@clerk/nextjs'
import { text } from 'figlet'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path=usePathname();
   
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
     <Image src={'/logo.svg'} width={100} height={10} alt='logo image'></Image>
     <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-black  hover:font-bold transition-all cursor-pointer ${path=='/dashboard'&&'text-blue-800 font-bold '}`}>Dashboard</li>
        <li className={`hover:text-text-black  hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions'&&'text-blue-800 font-bold '}`}>Questions</li>
        <li className={`hover:text-text-black  hover:font-bold transition-all cursor-pointer ${path=='/dashboard/upgrade'&&'text-blue-800 font-bold '}`}>Upgrade</li>
        <li className={`hover:text-text-black  hover:font-bold transition-all cursor-pointer ${path=='/dashboard/how'&&'text-blue-800 font-bold '}`}> how it Works</li>
     </ul>
     <UserButton></UserButton>
    </div>
  )
}

export default Header
