import React from "react";
import { Search, ShieldCheck, Zap, Terminal } from "lucide-react";

/**
 * DetectiveLayout provides the consistent "Cyber-Detective" UI wrapper for the project.
 * It includes the top navigation with the countdown timer and visual penalty feedback.
 */
const DetectiveLayout = ({ children, title, timer, penalty }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f1e7d0] font-mono selection:bg-[#4af626] selection:text-black relative overflow-x-hidden">
      {/* Vintage CRT Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Top Navigation Bar - FIXED POSITIONING FIX */}
      <nav className="border-b-2 border-[#f1e7d0]/20 bg-[#121212]/95 backdrop-blur-md fixed top-0 left-0 w-full z-[500] shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 border-2 border-[#f1e7d0] rounded-sm bg-[#f1e7d0] text-[#0d0d0d]">
              <Terminal size={24} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="block font-black text-2xl uppercase tracking-tighter leading-none">
                DEBUG<span className="text-[#4af626]">_DETECTIVE</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">System Revision v2.0.26</span>
            </div>
          </div>

          {/* Navigation Items: Timer and Penalty feedback */}
          <div className="flex items-center gap-6">
            {/* Countdown Timer with Visual Penalty Pop-up */}
            {timer && (
              <div className="relative group"> 
                <div className="bg-[#1a1a1a] border-2 border-[#f1e7d0]/30 px-6 py-2 rounded-none flex items-center gap-3 shadow-[4px_4px_0px_#f1e7d0]">
                  <span className="text-[10px] uppercase font-bold opacity-50 hidden md:inline">Remaining Time</span>
                  <span className="font-mono text-2xl font-bold text-[#4af626] drop-shadow-[0_0_8px_rgba(74,246,38,0.5)]">
                    {timer}
                  </span>
                </div>

                {/* --- NEW INTEGRATED CODE: VISUAL PENALTY POP-UP --- */}
                {/* Fixed Z-index to ensure it stays above scrolling content */}
                {penalty > 0 && (
                  <div className="absolute -bottom-12 right-0 text-red-500 font-black text-lg animate-bounce flex items-center gap-1 bg-black border-2 border-red-500 px-3 py-1 shadow-[4px_4px_0px_#ef4444] z-[600] whitespace-nowrap">
                    <Zap size={16} fill="currentColor" />
                    -{penalty}s
                  </div>
                )}
                {/* ------------------------------------------------- */}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area - Increased padding top (pt-32) to prevent content being hidden under fixed nav */}
      <main className="pt-32 pb-20 px-4 flex justify-center min-h-screen">
        <div className="w-full max-w-4xl animate-fade-in">
          {/* Case File Header: Displays the Phase title and Detective Icon */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-[#f1e7d0] pb-6 gap-4">
            <div className="space-y-1">
              <h2 className="text-sm text-[#4af626] font-bold uppercase tracking-[0.5em]">
                {">"} PRIORITY_OBJECTIVE
              </h2>
              <h1 className="text-4xl md:text-5xl font-black text-[#f1e7d0] uppercase italic tracking-tighter">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-4 opacity-40">
              <span className="text-[10px] font-bold">EST_1974</span>
              <ShieldCheck size={40} />
            </div>
          </div>

          {/* Dynamic Content: Where Level1, Level2, or Level3 content is rendered */}
          <div className="bg-[#161616] border-2 border-[#f1e7d0]/10 p-1 md:p-2 shadow-[20px_20px_0px_rgba(0,0,0,0.3)]">
             <div className="bg-[#1a1a1a] border border-[#f1e7d0]/20 p-8 md:p-12">
                {children}
             </div>
          </div>
        </div>
      </main>

      {/* Vintage Footer Decorations */}
      <div className="fixed bottom-4 left-6 opacity-20 text-[10px] hidden lg:block">
        LOG_SESSION: {new Date().getFullYear()} // ROOT_ACCESS_GRANTED
      </div>
      <div className="fixed bottom-4 right-6 opacity-20 text-[10px] hidden lg:block">
        TYPE: MK-VII_TERMINAL
      </div>
    </div>
  );
};

export default DetectiveLayout;