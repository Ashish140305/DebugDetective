import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  SkipForward,
  HelpCircle,
  Code,
  Terminal,
  CheckCircle2,
  XCircle,
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
  const [codeInputs, setCodeInputs] = useState({});
  const [triviaAnswer, setTriviaAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const snippetParts = useMemo(() => {
    if (!questionData?.codeSnippet) return [];
    return questionData.codeSnippet.split(/(_+)/);
  }, [questionData]);

  const fetchQuestion = () => {
    setFeedback("loading");
    setShowHint(false);
    setCodeInputs({});
    setTriviaAnswer("");

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
      const randomQ = QUESTIONS[randomIndex];

      // RESTORED: Log the answer to the console
      console.log(
        `%c[DEBUG_LOG] Expected Answer: "${randomQ.answer}"`,
        "color: #4cc9f0; font-weight: bold; font-size: 12px;",
      );

      setQuestionData({
        type: randomQ.type,
        question: randomQ.question,
        codeSnippet: randomQ.codeSnippet || null,
        answer: randomQ.answer,
        hint: randomQ.hint,
      });
      setFeedback(null);
    }, 600);
  };

  useEffect(() => {
    const savedIndex = sessionStorage.getItem("dd_q_index");
    if (savedIndex) setCurrentQIndex(parseInt(savedIndex));
    fetchQuestion();
  }, []);

  const handleCodeInputChange = (index, value) => {
    setCodeInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;

    let isCorrect = false;

    if (questionData.type === "code") {
      const userResponse = snippetParts
        .map((part, index) =>
          part.startsWith("_") ? codeInputs[index] || "" : null,
        )
        .filter((val) => val !== null)
        .join("")
        .trim();

      const cleanResponse = userResponse.replace(/[;)]+$/, "");
      isCorrect = checkSimilarity(
        cleanResponse,
        questionData.answer.trim(),
        0.85,
      );
    } else {
      isCorrect = checkSimilarity(triviaAnswer, questionData.answer, 0.8);
    }

    if (isCorrect) {
      setFeedback("success");
      setTimeout(() => {
        const nextIndex = currentQIndex + 1;
        if (nextIndex >= (CONFIG.questionsToSolve || 10)) {
          onSolve();
        } else {
          setCurrentQIndex(nextIndex);
          sessionStorage.setItem("dd_q_index", nextIndex);
          fetchQuestion();
        }
      }, 1000);
    } else {
      setFeedback("error");
      onPenalty(CONFIG.incorrectPenalty || 30);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleSkip = () => {
    onPenalty(CONFIG.skipPenalty || 15);
    fetchQuestion();
  };

  const totalQ = CONFIG.questionsToSolve || 10;

  if (!questionData)
    return (
      <div className="flex h-64 items-center justify-center text-white">
        Loading Quest...
      </div>
    );

  return (
    <DetectiveLayout
      title={`Stage ${currentQIndex + 1}/${totalQ}`}
      timer={timerDisplay}
      penalty={onPenaltyAmount}
      onAdminReset={onAdminReset}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-600">
          <div
            className="bg-gradient-to-r from-arcade-primary to-orange-500 h-full transition-all duration-500"
            style={{ width: `${(currentQIndex / totalQ) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-[#0f1524] rounded-2xl p-6 border-2 border-arcade-secondary shadow-inner relative">
          <div className="absolute -top-3 -left-3 bg-arcade-accent text-black font-bold px-3 py-1 rounded-lg shadow-md transform -rotate-2 font-game uppercase">
            {questionData.type === "code" ? "Bug Fix" : "Knowledge Check"}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-100 mt-4 mb-6 leading-relaxed font-body">
            {questionData.question}
          </h3>

          {questionData.type === "code" ? (
            <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-gray-300 border border-gray-700 overflow-x-auto shadow-2xl">
              <pre className="whitespace-pre-wrap leading-loose">
                {snippetParts.map((part, index) => {
                  if (part.startsWith("_")) {
                    const val = codeInputs[index] || "";
                    return (
                      <input
                        key={index}
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleCodeInputChange(index, e.target.value)
                        }
                        style={{
                          width: `${Math.max(val.length, part.length) + 1}ch`,
                        }}
                        className={`bg-gray-800 border-b-2 outline-none text-center text-arcade-success font-bold mx-1 rounded-t focus:bg-gray-700 transition-colors ${feedback === "error" ? "border-red-500" : "border-arcade-success"}`}
                        autoComplete="off"
                      />
                    );
                  }
                  return (
                    <span key={index} className="text-purple-300">
                      {part}
                    </span>
                  );
                })}
              </pre>
            </div>
          ) : questionData.codeSnippet ? (
            <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-gray-300 border border-gray-700 mb-4">
              <pre>{questionData.codeSnippet}</pre>
            </div>
          ) : null}
        </div>

        {/* Input & Actions */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {questionData.type !== "code" && (
            <div className="relative">
              <input
                type="text"
                value={triviaAnswer}
                onChange={(e) => setTriviaAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className={`input-game text-lg ${feedback === "error" ? "border-red-500 bg-red-900/10" : ""} ${feedback === "success" ? "border-green-500 bg-green-900/10" : ""}`}
                autoFocus
              />
              {feedback === "success" && (
                <CheckCircle2 className="absolute right-4 top-4 text-green-500" />
              )}
              {feedback === "error" && (
                <XCircle className="absolute right-4 top-4 text-red-500" />
              )}
            </div>
          )}

          <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between pt-4">
            <div className="flex gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={handleSkip}
                className="btn-game-secondary w-full md:w-auto text-sm flex items-center justify-center gap-2"
              >
                <SkipForward size={18} /> Skip (-{CONFIG.skipPenalty}s)
              </button>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="btn-game-secondary w-full md:w-auto text-sm bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 hover:bg-yellow-600/40 flex items-center justify-center gap-2"
              >
                <HelpCircle size={18} /> Hint
              </button>
            </div>

            <button
              type="submit"
              className="btn-game w-full md:w-auto flex items-center justify-center gap-2 min-w-[150px]"
            >
              {feedback === "loading" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Play size={20} fill="currentColor" /> Submit
                </>
              )}
            </button>
          </div>
        </form>

        {showHint && questionData.hint && (
          <div className="bg-yellow-900/30 border border-yellow-600/50 p-4 rounded-xl text-yellow-200 font-body animate-bounce-short">
            💡 <strong>Hint:</strong> {questionData.hint}
          </div>
        )}
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
