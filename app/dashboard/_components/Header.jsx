"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; 
import './Header.css'

function Header() {
  const router = useRouter(); 
  const path = usePathname();

  return (
    <div className="header-container">
      <Image
        src="/logo_2.png"
        width={130}
        height={50}
        alt="logo image"
        className="logo-image" 
      />
      <ul className="nav-list">
        <li 
          className={`nav-item ${path === "/dashboard" ? "nav-item-active" : ""}`} 
          onClick={() => router.push('/dashboard')} 
        >
          Dashboard
        </li>
        <li 
          className={`nav-item ${path === "/dashboard/Questions" ? "nav-item-active" : ""}`} 
          onClick={() => router.push('/dashboard/Questions')} >
          Questions
        </li>
       

       <li className={`nav-item ${path === "/dashboard/how" ? "nav-item-active" : ""}`}
       onClick={() => router.push('/dashboard/how')}
       >
      How it Works
</li>

      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
