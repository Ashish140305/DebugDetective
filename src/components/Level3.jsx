import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Trophy, Send, Star, Home } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level3 = ({ finalTime, onAdminReset }) => {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const randomTopic =
      CONFIG.researchTopics[
        Math.floor(Math.random() * CONFIG.researchTopics.length)
      ];
    setTopic(randomTopic);
  }, []);

  return (
    <DetectiveLayout title="Victory!" onAdminReset={onAdminReset}>
      <Confetti
        recycle={true}
        numberOfPieces={200}
        colors={["#e94560", "#ffd700", "#4cc9f0"]}
      />

      <div className="text-center space-y-8 animate-float">
        <div className="relative inline-block mt-8">
          <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20"></div>
          <Trophy
            size={100}
            className="text-arcade-accent filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            <Star className="text-arcade-accent fill-arcade-accent" size={24} />
            <Star className="text-arcade-accent fill-arcade-accent" size={32} />
            <Star className="text-arcade-accent fill-arcade-accent" size={24} />
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-game font-black text-white uppercase tracking-wider mb-2 text-shadow">
            Level Complete
          </h2>
          <div className="inline-block bg-white/10 px-6 py-2 rounded-full border border-white/20">
            <p className="text-xl font-body">
              Time:{" "}
              <span className="font-bold text-arcade-success">{finalTime}</span>
            </p>
          </div>
        </div>

        <div className="bg-[#0f1524] p-8 rounded-2xl border-2 border-arcade-secondary max-w-2xl mx-auto shadow-xl text-left">
          <h3 className="text-xl font-bold text-arcade-accent mb-2 font-game uppercase">
            Bonus Quest: Research Log
          </h3>
          <p className="text-gray-400 mb-6 font-body">
            Before you claim your prize, quickly document your findings on:{" "}
            <br />
            <span className="text-white font-bold text-lg">{topic}</span>
          </p>

          {!submitted ? (
            <div className="space-y-4">
              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Write your research notes here..."
                className="w-full h-32 p-4 bg-gray-800 rounded-xl border border-gray-600 text-white focus:border-arcade-primary outline-none transition-colors resize-none font-body"
              />
              <button
                onClick={() => setSubmitted(true)}
                disabled={report.length < 10}
                className="btn-game w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
              >
                <Send size={20} /> Finish Game
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Home className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Quest Complete!
              </h3>
              <p className="text-gray-400">
                Please wait for the administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level3;
