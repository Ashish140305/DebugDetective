import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Lightbulb,
} from "lucide-react";
import he from "he";
import DetectiveLayout from "./DetectiveLayout";
import { checkSimilarity } from "../utils/fuzzyMatch";
import { CONFIG } from "../gameConfig";
import { CODING_CHALLENGES } from "../data/codingQuestions";

const Level2 = ({ onSolve, timerDisplay, onPenalty }) => {
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
        if (nextIndex >= CONFIG.questionsToSolve) {
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
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSkip = () => {
    onPenalty(10);
    fetchQuestion();
    setUserAnswer("");
  };

  const progressPercent = (currentQIndex / CONFIG.questionsToSolve) * 100;

  return (
    <DetectiveLayout
      title="Case #002: Data Decryption"
      timer={timerDisplay}
      penalty={onPenalty.currentTotal}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
          <span>Progress</span>
          <span>
            {currentQIndex} / {CONFIG.questionsToSolve} Decrypted
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white text-slate-900 rounded-xl p-6 shadow-sm border-l-4 border-amber-500 relative min-h-[220px] flex flex-col justify-center">
          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 animate-pulse justify-center">
              <RefreshCw className="animate-spin" /> Fetching encrypted
              packet...
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="absolute top-4 right-4 opacity-10">
                {questionData.type === "code" ? (
                  <Code2 size={60} />
                ) : (
                  <BrainCircuit size={60} />
                )}
              </div>

              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                {questionData.type === "code"
                  ? "Code Analysis Required"
                  : "Security Question"}
              </h3>

              <p className="text-xl font-medium leading-snug pr-8 mb-4">
                {questionData.question}
              </p>

              {/* Code Snippet Display */}
              {questionData.codeSnippet && (
                <div className="bg-slate-900 text-green-400 font-mono p-4 rounded-lg text-sm md:text-base border-l-4 border-green-500 shadow-inner mb-4 overflow-x-auto">
                  <pre>{questionData.codeSnippet}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {questionData?.type === "code"
                ? "Enter Output / Missing Code"
                : "Decryption Key"}
            </label>

            <div className="relative">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type answer here..."
                autoFocus
                className={`w-full p-4 pl-4 pr-12 rounded-lg bg-slate-900 border-2 text-lg text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                  feedback === "error"
                    ? "border-red-500 animate-shake"
                    : feedback === "success"
                    ? "border-green-500"
                    : "border-slate-700 focus:border-amber-500"
                }`}
              />
              {feedback === "success" && (
                <CheckCircle2 className="absolute right-4 top-4 text-green-500 animate-bounce" />
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-slate-500 text-sm hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={14} /> Skip (+10s)
                </button>

                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-500 text-sm hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <Lightbulb size={14} />{" "}
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || feedback === "success"}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex-1 md:flex-none"
              >
                {feedback === "success" ? "Decrypting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Hint Display */}
          {showHint && questionData?.hint && (
            <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg text-amber-200 text-sm animate-fade-in-up flex gap-2 items-start">
              <Lightbulb size={16} className="mt-0.5 shrink-0" />
              <span>
                <strong>Hint:</strong> {questionData.hint}
              </span>
            </div>
          )}

          {feedback === "error" && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded border border-red-500/30">
              <AlertTriangle size={18} />
              <span>Incorrect. Access Denied.</span>
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
