import React from "react";
import { Search, ShieldCheck, Zap } from "lucide-react";

const DetectiveLayout = ({ children, title, timer, penalty }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500/30">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg text-slate-900">
              <Search size={20} strokeWidth={3} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Debug<span className="text-amber-500">Detective</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {penalty > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-red-400 text-sm font-medium animate-pulse">
                <Zap size={14} />
                <span>PENALTY: +{penalty}s</span>
              </div>
            )}

            {timer && (
              <div className="bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 flex items-center gap-2 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Case Timer
                </span>
                <span className="font-mono text-lg font-bold text-amber-500">
                  {timer}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-4 flex justify-center min-h-screen">
        <div className="w-full max-w-3xl animate-fade-in-up">
          {/* Case File Header */}
          <div className="mb-6 flex items-end justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm text-amber-500 font-bold uppercase tracking-widest mb-1">
                Current Objective
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {title}
              </h1>
            </div>
            <ShieldCheck className="text-slate-700 mb-2" size={32} />
          </div>

          {/* Dynamic Content */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 shadow-xl backdrop-blur-sm">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetectiveLayout;
