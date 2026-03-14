"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import './home.css'
import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Main_section from "./Components/Main_section/Main_section";
import About from "./Components/About/About";
import Footer from "./Components/Footer/Footer";
import Feature from "./Components/Feature/Feature";
import How from "./Components/How/How";
import Contact from "./Components/Contact/Contact";


export default function Home() {
  const [page, setPage] = useState("home"); 
  return (
    <>
    <Navbar setPage={setPage} />

    {page === "home" && (
      <>
        <div className="header" id="Home">
          <Main_section />
        </div>
        <div className="feature" id="feature">
          <Feature />
        </div>
        <div className="how" id="how">
          <How />
        </div>
        <div className="about" id="about">
          <About />
        </div>
      </>
    )}

    {page === "Contact" && <Contact></Contact>} 

    <div className="Footer">
      <Footer  setPage={setPage}  />
      
    </div>
  </>
   
     );
}
