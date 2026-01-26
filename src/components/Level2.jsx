import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  SkipForward,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { checkSimilarity } from "../utils/fuzzyMatch";
import { CONFIG } from "../gameConfig";
import QUESTIONS from "../data/level2_questions.json";
import {
  updateTeamProgress,
  getGameConfig,
  updateLiveGameStatus,
} from "../appwrite";

const Level2 = ({
  onSolve,
  timerDisplay,
  onPenalty,
  onPenaltyAmount,
  onAdminReset,
  pcId,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(() => {
    const saved = localStorage.getItem("dd_q_index");
    return saved ? parseInt(saved) : 0;
  });

  const [questionData, setQuestionData] = useState(null);
  const [codeInputs, setCodeInputs] = useState({});
  const [triviaAnswer, setTriviaAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [dbDocId, setDbDocId] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);

  const snippetParts = useMemo(() => {
    if (!questionData?.codeSnippet) return [];
    return questionData.codeSnippet.split(/(_+)/);
  }, [questionData]);

  useEffect(() => {
    const initSync = async () => {
      const storedPcId = localStorage.getItem("dd_pc_id");
      if (storedPcId) {
        const doc = await getGameConfig(storedPcId);
        if (doc) {
          setDbDocId(doc.$id);
          if (doc.history_logs) {
            try {
              setHistoryLogs(JSON.parse(doc.history_logs));
            } catch (e) {}
          }
        }
      }
    };
    initSync();
  }, []);

  const fetchQuestion = () => {
    setFeedback("loading");
    setShowHint(false);
    setCodeInputs({});
    setTriviaAnswer("");

    // 1. CALCULATE QUESTION IMMEDIATELY (No Delay)
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    const randomQ = QUESTIONS[randomIndex];

    console.log(
      `%c[DEBUG_LOG] Expected Answer: "${randomQ.answer}"`,
      "color: #4cc9f0; font-weight: bold; font-size: 12px;",
    );

    // 2. SEND TO DB IMMEDIATELY
    const docId = localStorage.getItem("dd_doc_id") || dbDocId;
    if (docId) {
      updateLiveGameStatus(docId, {
        active_question: randomQ.question,
        active_answer: randomQ.answer,
      });
    }

    // 3. SET LOCAL STATE WITH DELAY
    setTimeout(() => {
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
    fetchQuestion();
  }, []);

  useEffect(() => {
    localStorage.setItem("dd_q_index", currentQIndex);
  }, [currentQIndex]);

  const handleCodeInputChange = (index, value) => {
    setCodeInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;

    let isCorrect = false;

    if (questionData.type === "code") {
      const inputs = snippetParts
        .map((part, index) =>
          part.startsWith("_") ? codeInputs[index] || "" : null,
        )
        .filter((val) => val !== null);

      const allFilled = inputs.every((val) => val.trim().length > 0);

      if (!allFilled) {
        isCorrect = false;
      } else {
        const cleanAnswer = questionData.answer.trim();
        const cleanInputs = inputs.map((i) => i.trim().replace(/[;)]+$/, ""));
        const joinedInput = cleanInputs.join("");

        const matchJoined = checkSimilarity(joinedInput, cleanAnswer, 0.85);
        const matchIndividual = cleanInputs.every((input) =>
          checkSimilarity(input, cleanAnswer, 0.85),
        );

        isCorrect = matchJoined || matchIndividual;
      }
    } else {
      isCorrect = checkSimilarity(triviaAnswer, questionData.answer, 0.8);
    }

    if (isCorrect) {
      setFeedback("success");

      const newLog = {
        question: questionData.question,
        status: "SOLVED",
        time: new Date().toLocaleTimeString(),
      };
      const updatedHistory = [...historyLogs, newLog];
      setHistoryLogs(updatedHistory);

      if (dbDocId) {
        updateTeamProgress(dbDocId, null, currentQIndex + 1);
        updateLiveGameStatus(dbDocId, {
          history_logs: JSON.stringify(updatedHistory),
        });
      }

      setTimeout(() => {
        const nextIndex = currentQIndex + 1;
        if (nextIndex >= (CONFIG.questionsToSolve || 10)) {
          if (dbDocId) updateTeamProgress(dbDocId, 3, nextIndex);
          onSolve();
        } else {
          setCurrentQIndex(nextIndex);
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
    const skipLog = {
      question: questionData.question,
      status: "SKIPPED",
      time: new Date().toLocaleTimeString(),
    };
    const updatedHistory = [...historyLogs, skipLog];
    setHistoryLogs(updatedHistory);

    if (dbDocId) {
      updateLiveGameStatus(dbDocId, {
        history_logs: JSON.stringify(updatedHistory),
      });
    }
    fetchQuestion();
  };

  const totalQ = CONFIG.questionsToSolve || 10;

  if (!questionData)
    return (
      <div className="flex h-full items-center justify-center text-white flex-grow">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-arcade-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-sm animate-pulse">
            Fetching Challenge...
          </p>
        </div>
      </div>
    );

  return (
    <DetectiveLayout
      title={`Stage ${currentQIndex + 1}/${totalQ}`}
      timer={timerDisplay}
      penalty={onPenaltyAmount}
      onAdminReset={onAdminReset}
      pcId={pcId}
    >
      <div className="flex flex-col justify-center flex-grow w-full max-w-5xl mx-auto py-8">
        <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden border border-gray-700 mb-10">
          <div
            className="bg-gradient-to-r from-arcade-primary to-blue-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${(currentQIndex / totalQ) * 100}%` }}
          ></div>
        </div>

        <div className="bg-[#0f1524] rounded-2xl p-10 border-2 border-arcade-secondary shadow-[0_0_40px_rgba(0,0,0,0.4)] relative mb-10">
          <div className="absolute -top-3 -left-3 bg-arcade-accent text-black font-bold px-4 py-1.5 rounded-lg shadow-lg transform -rotate-1 font-game uppercase text-sm tracking-wider">
            {questionData.type === "code"
              ? "Bug Fix Protocol"
              : "Knowledge Check"}
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mt-2 mb-8 leading-relaxed font-body text-center max-w-4xl">
              {questionData.question}
            </h3>

            {questionData.type === "code" ? (
              <div className="w-fit max-w-full bg-[#1a1a1a] rounded-xl p-8 font-mono text-gray-300 border border-gray-700 shadow-inner overflow-x-auto text-left">
                <pre className="whitespace-pre-wrap leading-loose text-lg md:text-xl">
                  {snippetParts.map((part, index) => {
                    if (part.startsWith("_")) {
                      const val = codeInputs[index] || "";
                      const inputWidth = Math.max(val.length, 2) + 2;
                      return (
                        <input
                          key={index}
                          type="text"
                          value={val}
                          onChange={(e) =>
                            handleCodeInputChange(index, e.target.value)
                          }
                          style={{ width: `${inputWidth}ch` }}
                          className={`bg-gray-800 border-b-2 outline-none text-center font-bold mx-1 rounded px-1 py-0.5 align-middle transition-colors ${feedback === "error" ? "border-red-500 text-red-400 bg-red-900/20" : val ? "border-arcade-primary text-arcade-primary" : "border-gray-500 text-gray-300"} focus:bg-gray-700 focus:border-arcade-primary`}
                          autoComplete="off"
                          spellCheck="false"
                        />
                      );
                    }
                    return (
                      <span
                        key={index}
                        className="text-purple-300 align-middle"
                      >
                        {part}
                      </span>
                    );
                  })}
                </pre>
              </div>
            ) : questionData.codeSnippet ? (
              <div className="w-fit max-w-full bg-[#1e1e1e] rounded-xl p-8 font-mono text-gray-300 border border-gray-700 mb-6 text-left">
                <pre>{questionData.codeSnippet}</pre>
              </div>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questionData.type !== "code" && (
            <div className="relative max-w-3xl mx-auto w-full">
              <input
                type="text"
                value={triviaAnswer}
                onChange={(e) => setTriviaAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className={`input-game text-xl w-full py-5 px-8 text-center ${feedback === "error" ? "border-red-500 bg-red-900/10 focus:border-red-400" : ""} ${feedback === "success" ? "border-green-500 bg-green-900/10" : ""}`}
                autoFocus
              />
              {feedback === "success" && (
                <CheckCircle2
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                  size={28}
                />
              )}
              {feedback === "error" && (
                <XCircle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                  size={28}
                />
              )}
            </div>
          )}

          <div className="flex flex-col-reverse md:flex-row gap-6 items-center justify-between max-w-4xl mx-auto w-full">
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleSkip}
                className="btn-game-secondary w-full md:w-auto text-base flex items-center justify-center gap-2 py-4 px-6"
              >
                <SkipForward size={20} /> Skip (-{CONFIG.skipPenalty}s)
              </button>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="btn-game-secondary w-full md:w-auto text-base bg-yellow-600/10 text-yellow-500 border-yellow-600/40 hover:bg-yellow-600/20 flex items-center justify-center gap-2 py-4 px-6"
              >
                <HelpCircle size={20} /> Hint
              </button>
            </div>
            <button
              type="submit"
              className="btn-game w-full md:w-auto flex items-center justify-center gap-3 min-w-[200px] py-4 text-xl shadow-[0_0_20px_rgba(76,201,240,0.3)] hover:shadow-[0_0_30px_rgba(76,201,240,0.5)]"
            >
              {feedback === "loading" ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Play size={24} fill="currentColor" /> Submit Output
                </>
              )}
            </button>
          </div>
        </form>

        {showHint && questionData.hint && (
          <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 p-6 rounded-xl text-yellow-200 font-body animate-fade-in flex items-start gap-3 max-w-3xl mx-auto">
            <span className="text-2xl">💡</span>
            <p className="pt-1 text-lg">
              <strong>Hint:</strong> {questionData.hint}
            </p>
          </div>
        )}
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
