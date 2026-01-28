import React, { useState } from "react";
import { ScrollText, Clock, ShieldCheck } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";

const Level3 = ({ finalTime, onAdminReset }) => {
  // Fixed topic as requested
  const [topic] = useState("Edge AI & Embedded Intelligence");

  return (
    <DetectiveLayout title="Mission Accomplished" onAdminReset={onAdminReset}>
      <div className="flex flex-col items-center justify-center min-h-[600px] animate-fade-in relative z-10 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="relative mb-12 text-center group">
          <div className="absolute inset-0 bg-yellow-500/10 blur-[80px] rounded-full animate-pulse-slow"></div>

          <h1 className="text-5xl md:text-6xl font-game font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 uppercase tracking-widest drop-shadow-sm leading-tight relative z-10">
            Prepare Presentation
          </h1>
          <p className="text-blue-200 font-mono tracking-[0.3em] text-sm mt-4 uppercase opacity-80 relative z-10">
            System Secured • Threat Neutralized
          </p>
        </div>

        {/* Time Stats Badge - Shows Time Taken */}
        <div className="mb-12 transform hover:scale-105 transition-all">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Clock className="text-yellow-400" size={24} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-yellow-500/70 text-xs font-bold uppercase tracking-wider">
                Time Taken
              </span>
              <span className="text-3xl font-mono font-bold text-white tracking-widest text-shadow">
                {finalTime}
              </span>
            </div>
          </div>
        </div>

        {/* Presentation Card */}
        <div className="w-full max-w-2xl px-4">
          <div className="bg-[#0f1524]/90 backdrop-blur-xl rounded-2xl border border-arcade-primary/30 shadow-2xl overflow-hidden relative">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="text-arcade-primary" size={20} />
                <span className="font-game text-white tracking-wider">
                  FINAL OBJECTIVE
                </span>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                STATUS: COMPLETED
              </span>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-400 text-sm font-mono mb-2 uppercase tracking-wider">
                    Research Directive:
                  </h3>
                  <div className="bg-black/40 p-6 rounded-xl border-l-4 border-arcade-accent">
                    <p className="text-2xl md:text-3xl font-bold text-white font-game leading-relaxed tracking-wide text-center">
                      {topic}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700/50 text-center">
                  <div className="inline-block p-3 rounded-full bg-green-500/10 mb-2">
                    <ShieldCheck size={32} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Great work, Detective. <br />
                    <span className="text-arcade-primary">
                      Please standby for Admin verification.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer Decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-arcade-primary via-purple-500 to-arcade-accent"></div>
          </div>
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level3;
