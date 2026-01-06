import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Trophy, Send, Check } from "lucide-react";
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
    <DetectiveLayout
      title="Mission Complete"
      onAdminReset={onAdminReset} // <--- Passed to Layout
    >
      {!submitted && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full text-green-600 dark:text-green-400 mb-4">
            <Trophy size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Systems Unlocked
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Completed in{" "}
            <span className="font-mono font-bold text-gray-900 dark:text-white">
              {finalTime}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-left">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Final Assignment
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-4">
            {topic}
          </h3>

          {!submitted ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please provide a brief outline of the topic above:
              </p>
              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Write your outline here..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
              <button
                onClick={() => setSubmitted(true)}
                disabled={report.length < 10}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} /> Submit Report
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg mb-4">
                <Check size={24} /> Report Submitted
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Thank you for your participation.
              </p>
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level3;
