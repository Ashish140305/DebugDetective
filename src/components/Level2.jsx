import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Lightbulb,
  Fingerprint
} from "lucide-react";
import he from "he";
import DetectiveLayout from "./DetectiveLayout";
import { checkSimilarity } from "../utils/fuzzyMatch";
import { CONFIG } from "../gameConfig";
import { CODING_CHALLENGES } from "../data/codingQuestions";

const Level2 = ({ onSolve, timerDisplay, onPenalty, onPenaltyAmount }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false); // State for hint visibility

  // --- PERSISTENT CONSOLE LOGGING ---
  const logToConsole = (q, a, type = "NEW") => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${type}] \nQ: ${q} \nA: ${a}`;
    console.log(
      `%c ${logEntry}`,
      "background: #222; color: #bada55; font-size: 12px; padding: 4px;"
    );

    const history = JSON.parse(
      sessionStorage.getItem("dd_console_history") || "[]"
    );
    history.push(logEntry);
    sessionStorage.setItem("dd_console_history", JSON.stringify(history));
  };

  useEffect(() => {
    const history = JSON.parse(
      sessionStorage.getItem("dd_console_history") || "[]"
    );
    if (history.length > 0) {
      history.forEach((entry) => console.log(entry));
    }
  }, []);

  // --- QUESTION GENERATION LOGIC ---
  const fetchQuestion = async () => {
    setLoading(true);
    setShowHint(false); // Hide hint on new question

    // 50% Chance: Coding Challenge OR API Trivia
    const useCodingQuestion = Math.random() > 0.5;

    if (useCodingQuestion) {
      // --- LOCAL CODING QUESTION ---
      const randomChallenge =
        CODING_CHALLENGES[Math.floor(Math.random() * CODING_CHALLENGES.length)];

      setQuestionData({
        type: "code",
        question: randomChallenge.question,
        codeSnippet: randomChallenge.codeSnippet,
        answer: randomChallenge.answer,
        hint: randomChallenge.hint,
      });

      logToConsole(
        randomChallenge.question,
        randomChallenge.answer,
        `CODING Q (${currentQIndex + 1})`
      );
      setLoading(false);
    } else {
      // --- API TRIVIA QUESTION ---
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=1&category=18&difficulty=medium&type=multiple"
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const q = data.results[0];
          const cleanQ = he.decode(q.question);
          const cleanA = he.decode(q.correct_answer);

          // Generate a generic hint for API questions
          const firstLetter = cleanA.charAt(0);
          const wordCount = cleanA.split(" ").length;
          const genericHint = `Starts with "${firstLetter}" and has ${wordCount} word(s).`;

          setQuestionData({
            type: "trivia",
            question: cleanQ,
            answer: cleanA,
            hint: genericHint,
            codeSnippet: null,
          });

          logToConsole(cleanQ, cleanA, `TRIVIA Q (${currentQIndex + 1})`);
        }
      } catch (error) {
        console.error("API Error", error);
        // Fallback to a coding question if API fails
        const fallback = CODING_CHALLENGES[0];
        setQuestionData(fallback);
        logToConsole(fallback.question, fallback.answer, "FALLBACK");
      }
      setLoading(false);
    }
  };

  // --- INITIAL LOAD & REFRESH CHECK ---
  useEffect(() => {
    const savedIndex = sessionStorage.getItem("dd_q_index");
    if (savedIndex) {
      setCurrentQIndex(parseInt(savedIndex));
      const wasRefreshed = sessionStorage.getItem("dd_page_refreshed");
      if (wasRefreshed) {
        onPenalty(10);
        sessionStorage.removeItem("dd_page_refreshed");
      }
    }
    const handleUnload = () =>
      sessionStorage.setItem("dd_page_refreshed", "true");
    window.addEventListener("beforeunload", handleUnload);

    fetchQuestion();

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // --- SUBMISSION LOGIC ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;

    // --- INTEGRATED CODE: BLANK SUBMISSION CHECK ---
    // Requirement: Blank answers should not deduct time
    if (!userAnswer.trim()) {
      setFeedback("blank");
      setTimeout(() => setFeedback(null), 2000);
      return; // Stop execution without calling onPenalty
    }
    // ---------------------------------------------------

    // Use tighter fuzzy match for code (90%), looser for trivia (80%)
    const threshold = questionData.type === "code" ? 0.9 : 0.8;
    const isCorrect = checkSimilarity(
      userAnswer,
      questionData.answer,
      threshold
    );

    if (isCorrect) {
      setFeedback("success");
      setTimeout(() => {
        const nextIndex = currentQIndex + 1;
        if (nextIndex >= (CONFIG.questionsToSolve || 10)) {
          onSolve();
          sessionStorage.removeItem("dd_q_index");
        } else {
          setCurrentQIndex(nextIndex);
          sessionStorage.setItem("dd_q_index", nextIndex);
          setUserAnswer("");
          setFeedback(null);
          fetchQuestion();
        }
      }, 1000);
    } else {
      setFeedback("error");
      // Requirement: -30s for incorrect answers
      const penaltyValue = CONFIG.incorrectPenalty || 30;
      onPenalty(penaltyValue); 
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSkip = () => {
    // Requirement: -15s for skipped questions
    const penaltyAmount = CONFIG.skipPenalty || 15;
    onPenalty(penaltyAmount); 
    fetchQuestion();
    setUserAnswer("");
  };

  const progressPercent = (currentQIndex / (CONFIG.questionsToSolve || 10)) * 100;

  return (
    <DetectiveLayout
      title="Timed Interrogation"
      timer={timerDisplay}
      penalty={onPenaltyAmount}
    >
      <div className="space-y-10">
        {/* Progress Bar - Revamped for Vintage Theme */}
        <div className="space-y-2">
           <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1e7d0]/50">
             <span>Transmission Progress</span>
             <span>Packet {currentQIndex + 1} / {CONFIG.questionsToSolve || 10}</span>
           </div>
           <div className="w-full bg-[#121212] h-4 border border-[#f1e7d0]/20 p-1">
             <div 
               className="bg-[#4af626] h-full transition-all duration-700 shadow-[0_0_10px_#4af626]" 
               style={{ width: `${progressPercent}%` }}
             ></div>
           </div>
        </div>

        {/* Question Card - Dossier Style */}
        <div className="relative border-l-4 border-[#4af626] pl-8 py-2 min-h-[220px]">
          {loading ? (
            <div className="flex items-center gap-4 text-[#4af626] animate-pulse italic">
              <RefreshCw className="animate-spin" size={20} />
              <span>DECRYPTING DATA PACKET...</span>
            </div>
          ) : (
            <div className="animate-fade-in-up space-y-6">
              <div className="flex items-center gap-3 opacity-50">
                <Fingerprint size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Evidence_Source: {questionData.type === "code" ? "Compiler_Logs" : "Intel_Database"}
                </span>
              </div>

              <p className="text-2xl md:text-3xl font-bold leading-tight text-[#f1e7d0] drop-shadow-sm">
                {questionData.question}
              </p>

              {/* Code Snippet Display - Matrix Style */}
              {questionData.codeSnippet && (
                <div className="bg-[#0a0a0a] p-6 border border-[#f1e7d0]/10 rounded-sm overflow-x-auto shadow-inner">
                  <pre className="text-[#4af626] font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    <code>{questionData.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Section - Terminal Prompt Revamp */}
        <div className="pt-6 border-t border-[#f1e7d0]/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1e7d0]/40 mb-3 group-focus-within:text-[#4af626] transition-colors">
                {">"} input_decryption_key
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="........"
                  autoFocus
                  className={`w-full bg-transparent border-b-2 p-0 pb-2 text-3xl font-bold transition-all focus:outline-none ${
                    feedback === "error"
                      ? "border-red-500 text-red-500 animate-shake"
                      : feedback === "success"
                      ? "border-[#4af626] text-[#4af626]"
                      : "border-[#f1e7d0]/20 focus:border-[#4af626] text-[#f1e7d0] placeholder:text-[#f1e7d0]/10"
                  }`}
                />
                {feedback === "success" && (
                  <CheckCircle2 className="absolute right-0 top-0 text-[#4af626] animate-bounce" />
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[#f1e7d0]/40 hover:text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={12} /> Skip_Packet (-{CONFIG.skipPenalty || 15}s)
                </button>

                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[#4af626]/60 hover:text-[#4af626] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Lightbulb size={12} /> {showHint ? "Hide_Intel" : "Access_Hint"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || feedback === "success"}
                className="w-full md:w-auto bg-[#f1e7d0] hover:bg-[#4af626] disabled:opacity-30 text-[#0d0d0d] px-12 py-4 font-black uppercase tracking-tighter transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(74,246,38,0.3)]"
              >
                {feedback === "success" ? "TRANSMITTING..." : "Execute_Decrypt"}
              </button>
            </div>
          </form>

          {/* Messages & Overlays */}
          {showHint && questionData?.hint && (
            <div className="mt-6 p-4 bg-[#4af626]/5 border border-[#4af626]/20 text-[#4af626] text-xs italic animate-fade-in-up">
              <strong>ENCRYPTED_HINT:</strong> {questionData.hint}
            </div>
          )}

          {feedback === "error" && (
            <div className="mt-6 p-4 border-2 border-red-500 text-red-500 text-xs font-bold uppercase tracking-widest">
              ACCESS_DENIED: Incorrect_Input_Sequence.
            </div>
          )}

          {feedback === "blank" && (
            <div className="mt-6 p-4 border-2 border-amber-500/50 text-amber-500 text-xs font-bold uppercase tracking-widest animate-pulse">
              SYSTEM_WARNING: Field_Required. Proceed_Prevented.
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level2;