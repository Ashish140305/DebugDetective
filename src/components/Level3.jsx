import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { FileSignature, Trophy, Send, Terminal } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level3 = ({ finalTime, onReset }) => {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const randomTopic = CONFIG.researchTopics[Math.floor(Math.random() * CONFIG.researchTopics.length)];
    setTopic(randomTopic);
  }, []);

  return (
    <DetectiveLayout title="Phase 3: Technical Briefing">
      {!submitted && <Confetti recycle={false} numberOfPieces={300} gravity={0.2} />}
      
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-block p-4 bg-green-500 rounded-full text-slate-900 mb-4 animate-bounce">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white">Case Logic Bypassed</h1>
          <p className="text-slate-400">Technical competency verified in {finalTime}.</p>
        </div>

        <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-8 border-amber-500">
          <div className="flex items-center gap-3 mb-6 text-amber-600">
            <FileSignature size={28} />
            <h2 className="font-black text-xl uppercase tracking-tighter">Classified Assignment</h2>
          </div>

          <p className="text-sm text-slate-500 uppercase font-bold mb-1">Subject Matter:</p>
          <p className="text-2xl font-black leading-tight text-slate-900 mb-6">{topic}</p>

          {!submitted ? (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-slate-600 text-sm italic border-l-2 border-slate-300 pl-4">
                "Agent, provide a structured outline explaining the core principles of this topic to high-level command."
              </p>
              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Enter presentation outline (Core concepts, implementation, pros/cons)..."
                className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-mono text-sm"
              />
              <button 
                onClick={() => setSubmitted(true)}
                disabled={report.length < 50}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                <Send size={18} /> Submit Final Dossier
              </button>
            </div>
          ) : (
            <div className="text-center py-6 animate-fade-in-up">
              <div className="bg-green-100 text-green-700 p-4 rounded-lg font-bold mb-6">
                REPORT TRANSMITTED SUCCESSFULLY
              </div>
              <button onClick={onReset} className="flex items-center gap-2 mx-auto text-slate-500 hover:text-slate-900 font-bold transition-colors">
                <Terminal size={18} /> Exit Secure Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level3;