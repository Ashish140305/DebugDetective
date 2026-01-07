import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  HelpCircle,
} from "lucide-react";
import he from "he";
import DetectiveLayout from "./DetectiveLayout";
import { checkSimilarity } from "../utils/fuzzyMatch";
import { CONFIG } from "../gameConfig";
import { CODING_CHALLENGES } from "../data/codingQuestions";

const Level2 = ({
  onSolve,
  timerDisplay,
  onPenalty,
  onPenaltyAmount,
  onAdminReset,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // --- LOGGING Logic ---
  const logToConsole = (q, a, type = "NEW") => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${type}] \nQ: ${q} \nA: ${a}`;
    console.log(
      `%c ${logEntry}`,
      "background: #eee; color: #333; font-size: 12px; padding: 4px; border: 1px solid #ccc;"
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
    if (history.length > 0) history.forEach((entry) => console.log(entry));
  }, []);

  // --- FETCH Logic ---
  const fetchQuestion = async () => {
    setLoading(true);
    setShowHint(false);

    const useCodingQuestion = Math.random() > 0.5;

    if (useCodingQuestion) {
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
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=1&category=18&difficulty=medium&type=multiple"
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const q = data.results[0];
          const cleanQ = he.decode(q.question);
          const cleanA = he.decode(q.correct_answer);
          const firstLetter = cleanA.charAt(0);
          const wordCount = cleanA.split(" ").length;
          setQuestionData({
            type: "trivia",
            question: cleanQ,
            answer: cleanA,
            hint: `Starts with "${firstLetter}" (${wordCount} words)`,
            codeSnippet: null,
          });
          logToConsole(cleanQ, cleanA, `TRIVIA Q (${currentQIndex + 1})`);
        }
      } catch (error) {
        // Fallback
        const fallback = CODING_CHALLENGES[0];
        setQuestionData(fallback);
      }
      setLoading(false);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;
    if (!userAnswer.trim()) {
      setFeedback("blank");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

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
      onPenalty(CONFIG.incorrectPenalty || 30);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSkip = () => {
    onPenalty(CONFIG.skipPenalty || 15);
    fetchQuestion();
    setUserAnswer("");
  };

  const totalQ = CONFIG.questionsToSolve || 10;
  const progressPercent = (currentQIndex / totalQ) * 100;

  return (
    <DetectiveLayout
      title="Level 2: Investigation"
      timer={timerDisplay}
      penalty={onPenaltyAmount}
      onAdminReset={onAdminReset} // <--- Passed to Layout
    >
      <div className="space-y-8">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
            <span>Progress</span>
            <span>
              {currentQIndex} / {totalQ} Solved
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="min-h-50">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
              <RefreshCw className="animate-spin" /> Loading next question...
            </div>
          ) : (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                {questionData.type === "code" ? (
                  <Code2 size={16} />
                ) : (
                  <HelpCircle size={16} />
                )}
                {questionData.type === "code"
                  ? "Code Analysis"
                  : "Technical Trivia"}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                {questionData.question}
              </h3>

              {questionData.codeSnippet && (
                <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                  <pre>{questionData.codeSnippet}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
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

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                >
                  Skip Question (-{CONFIG.skipPenalty || 15}s)
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Lightbulb size={14} />{" "}
                  {showHint ? "Hide Hint" : "Need Hint?"}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || feedback === "success"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm disabled:opacity-50 transition-all"
              >
                Submit
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
              Incorrect answer. Time penalty applied.
            </div>
          )}
          {feedback === "blank" && (
            <div className="mt-2 text-orange-500 text-sm font-medium">
              Please enter an answer.
            </div>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
