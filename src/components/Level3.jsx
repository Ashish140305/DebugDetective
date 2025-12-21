import React from "react";
import Confetti from "react-confetti";
import { FileSignature, Trophy } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level3 = ({ finalTime }) => {
  return (
    <DetectiveLayout title="Case Closed">
      <Confetti
        recycle={false}
        numberOfPieces={400}
        colors={["#fbbf24", "#ffffff", "#1e293b"]}
      />

      <div className="text-center py-8">
        <div className="inline-block p-4 bg-amber-500 rounded-full text-slate-900 mb-6 shadow-lg shadow-amber-500/30 animate-bounce">
          <Trophy size={48} />
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          Investigation Complete
        </h1>
        <p className="text-slate-400 mb-8">
          All digital locks have been bypassed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-500 text-xs uppercase font-bold mb-1">
              Total Time
            </p>
            <p className="text-3xl font-mono text-white">{finalTime}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-500 text-xs uppercase font-bold mb-1">
              Status
            </p>
            <p className="text-3xl font-mono text-green-400">SUCCESS</p>
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-xl p-8 shadow-xl text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full"></div>

          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <FileSignature size={24} />
            <h2 className="font-bold text-lg uppercase tracking-wider">
              Final Assignment
            </h2>
          </div>

          <p className="text-3xl font-bold leading-tight mb-2">
            {CONFIG.researchTopic}
          </p>

          <p className="text-slate-500 mt-4 text-sm border-t border-slate-200 pt-4">
            Please proceed to compile your report on the above topic.
          </p>
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level3;
