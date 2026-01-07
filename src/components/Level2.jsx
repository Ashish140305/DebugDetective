import React, { useState, useEffect, useMemo } from "react";
import {
  RefreshCw,
  CheckCircle2,
  Lightbulb,
  Code2,
  HelpCircle,
  Play,
} from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { checkSimilarity } from "../utils/fuzzyMatch";
import { CONFIG } from "../gameConfig";
import QUESTIONS from "../data/level2_questions.json";

const Level2 = ({
  onSolve,
  timerDisplay,
  onPenalty,
  onPenaltyAmount,
  onAdminReset,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);

  // Stores values for code blanks: { 0: "val", 1: "val" }
  const [codeInputs, setCodeInputs] = useState({});
  const [triviaAnswer, setTriviaAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // --- LOGGING ---
  const logToConsole = (q, a, type = "NEW") => {
    const timestamp = new Date().toLocaleTimeString();

    // Clearer styling for visibility
    console.log(
      `%c 🕵️ DETECTIVE LOG [${timestamp}] \n%c❓ Q: ${q}\n%c✅ A: ${a}`,
      "color: #888; font-weight: bold;",
      "color: #d97706; font-weight: bold; font-size: 1.1em;", // Orange for Question
      "color: #059669; font-weight: bold; font-size: 1.2em;" // Green for Answer
    );

    const logEntry = `[${timestamp}] [${type}] Q: ${q} | A: ${a}`;
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
      console.log("%c--- PREVIOUS LOGS ---", "color: #666");
      history.forEach((entry) => console.log(entry));
    }
  }, []);

  // --- PARSING SNIPPETS ---
  const snippetParts = useMemo(() => {
    if (!questionData?.codeSnippet) return [];
    // Split by underscores to find blanks
    return questionData.codeSnippet.split(/(_+)/);
  }, [questionData]);

  // --- FETCH Logic ---
  const fetchQuestion = () => {
    setLoading(true);
    setShowHint(false);
    setCodeInputs({});
    setTriviaAnswer("");
    setFeedback(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
      const randomQ = QUESTIONS[randomIndex];

      setQuestionData({
        type: randomQ.type,
        question: randomQ.question,
        codeSnippet: randomQ.codeSnippet || null,
        answer: randomQ.answer,
        hint: randomQ.hint,
      });

      logToConsole(
        randomQ.question,
        randomQ.answer,
        `${randomQ.type.toUpperCase()} Q (${currentQIndex + 1})`
      );

      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    const savedIndex = sessionStorage.getItem("dd_q_index");
    if (savedIndex) {
      setCurrentQIndex(parseInt(savedIndex));
      if (sessionStorage.getItem("dd_page_refreshed")) {
        onPenalty(300);
        sessionStorage.removeItem("dd_page_refreshed");
      }
    }
    const handleUnload = () =>
      sessionStorage.setItem("dd_page_refreshed", "true");
    window.addEventListener("beforeunload", handleUnload);

    fetchQuestion();

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleCodeInputChange = (index, value) => {
    setCodeInputs((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;

    let isCorrect = false;

    if (questionData.type === "code") {
      // 1. EXTRACT USER INPUT
      const userResponse = snippetParts
        .map((part, index) => {
          if (part.startsWith("_")) {
            return codeInputs[index] || "";
          }
          return null;
        })
        .filter((val) => val !== null)
        .join("") // Join inputs if multiple blanks exist
        .trim();

      if (!userResponse) {
        setFeedback("blank");
        setTimeout(() => setFeedback(null), 2000);
        return;
      }

      // 2. CLEANUP & COMPARE
      const cleanUserResponse = userResponse.replace(/[;)]+$/, "");
      const cleanAnswer = questionData.answer.trim();

      // Check similarity on the ANSWER ONLY
      isCorrect = checkSimilarity(cleanUserResponse, cleanAnswer, 0.85);
    } else {
      // Trivia
      if (!triviaAnswer.trim()) {
        setFeedback("blank");
        setTimeout(() => setFeedback(null), 2000);
        return;
      }
      isCorrect = checkSimilarity(triviaAnswer, questionData.answer, 0.8);
    }

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
          fetchQuestion();
        }
      }, 1000);
    } else {
      setFeedback("error");
      onPenalty(CONFIG.incorrectPenalty || 30);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSkip = () => {
    onPenalty(CONFIG.skipPenalty || 15);
    fetchQuestion();
  };

  const totalQ = CONFIG.questionsToSolve || 10;
  const progressPercent = (currentQIndex / totalQ) * 100;

  return (
    <DetectiveLayout
      title="Level 2: Code Decryption Protocol"
      timer={timerDisplay}
      penalty={onPenaltyAmount}
      onAdminReset={onAdminReset}
    >
      <div className="space-y-8">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
            <span>System Integrity</span>
            <span>
              {currentQIndex} / {totalQ} Patched
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area - Increased min-height for better look */}
        <div className="min-h-50">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 gap-2">
              <RefreshCw className="animate-spin" /> Fetching corrupted
              segment...
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                {questionData.type === "code" ? (
                  <Code2 size={16} />
                ) : (
                  <HelpCircle size={16} />
                )}
                {questionData.type === "code"
                  ? "Syntax Error Detected"
                  : "Security Challenge"}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
                {questionData.question}
              </h3>

              {questionData.type === "code" ? (
                // --- INLINE CODE EDITOR ---
                <div className="bg-gray-100 dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-700 font-mono text-lg text-gray-800 dark:text-gray-200 shadow-inner overflow-x-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {snippetParts.map((part, index) => {
                      if (part.startsWith("_")) {
                        const val = codeInputs[index] || "";
                        // Dynamic width: max(length of current val, length of placeholder/minimum) + buffer
                        const minLength = Math.max(part.length, 3);
                        const currentLength = val.length;
                        const widthCh = Math.max(minLength, currentLength) + 1;

                        return (
                          <input
                            key={index}
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleCodeInputChange(index, e.target.value)
                            }
                            // Apply dynamic width in 'ch' units
                            style={{ width: `${widthCh}ch` }}
                            placeholder="___"
                            className={`
                              bg-transparent border-b-2 outline-none text-center mx-1 transition-all duration-200
                              font-bold text-blue-700 dark:text-blue-400 placeholder-gray-300 dark:placeholder-gray-700
                              ${
                                feedback === "error"
                                  ? "border-red-500 bg-red-50/50"
                                  : "border-gray-400 focus:border-blue-500"
                              }
                            `}
                            autoComplete="off"
                          />
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </pre>
                </div>
              ) : (
                // --- TRIVIA VIEW ---
                questionData.codeSnippet && (
                  <div className="bg-gray-100 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 font-mono text-base text-gray-800 dark:text-gray-200">
                    <pre>{questionData.codeSnippet}</pre>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {questionData?.type !== "code" && (
              <div className="relative">
                <input
                  type="text"
                  value={triviaAnswer}
                  onChange={(e) => setTriviaAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  autoFocus
                  className={`w-full text-lg px-4 py-3 border-2 rounded-lg outline-none transition-all dark:bg-slate-900 dark:text-white ${
                    feedback === "error"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : feedback === "success"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-slate-600 focus:border-blue-500"
                  }`}
                />
                {feedback === "success" && (
                  <CheckCircle2 className="absolute right-4 top-4 text-green-600 animate-bounce" />
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                >
                  Skip Patch (-{CONFIG.skipPenalty || 15}s)
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Lightbulb size={14} />{" "}
                  {showHint ? "Hide Hint" : "Analyze Hint"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || feedback === "success"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {questionData?.type === "code" ? <Play size={18} /> : null}
                {questionData?.type === "code" ? "Execute Fix" : "Submit"}
              </button>
            </div>
          </form>

          {showHint && questionData?.hint && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
              <strong>Hint:</strong> {questionData.hint}
            </div>
          )}

          {feedback === "error" && (
            <div className="mt-2 text-red-600 dark:text-red-400 text-sm font-medium">
              Error: Patch failed. Integrity mismatch. Time penalty applied.
            </div>
          )}
          {feedback === "blank" && (
            <div className="mt-2 text-orange-500 text-sm font-medium">
              Please input data before executing.
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
