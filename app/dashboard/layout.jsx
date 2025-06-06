"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import Header from "./_components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="layout-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Header: slide down from above */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      {/* Main content: slide in from left, flex-grow to fill space */}
      <motion.main
        className="main-content"
        style={{ flexGrow: 1 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      {/* Footer: slide up from below */}
      <motion.footer
        className="footer"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", padding: "15px 0", backgroundColor: "#3c65f5", color: "white" }}
      >
        © 2025 IntraAi. All rights reserved.
      </motion.footer>
    </div>
  );
}
