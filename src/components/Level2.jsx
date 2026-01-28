import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  CheckCircle,
  XCircle,
  Terminal,
  Code2,
  CornerDownLeft,
  Globe,
  Trophy,
  SkipForward,
} from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";
import {
  updateTeamProgress,
  getGameConfig,
  updateLiveGameStatus,
} from "../appwrite";
import { generateQuestions } from "../data/questionFactory";
import { executeCode } from "../utils/codeExecutor";

// Generate 150 Unique Questions
const QUESTIONS = generateQuestions(150);
const TARGET_SOLVED = 10;

const Level2 = ({
  onSolve,
  timerDisplay,
  onPenalty,
  onPenaltyAmount,
  onAdminReset,
  pcId,
}) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(() =>
    parseInt(localStorage.getItem("dd_q_index") || "0"),
  );
  const [solvedCount, setSolvedCount] = useState(() =>
    parseInt(localStorage.getItem("dd_l2_solved") || "0"),
  );

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const challenge = QUESTIONS[currentLevelIdx % QUESTIONS.length];

  const [userCode, setUserCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const textAreaRef = useRef(null);

  // Sync with Admin
  useEffect(() => {
    const docId = localStorage.getItem("dd_doc_id");
    if (docId) {
      updateLiveGameStatus(docId, {
        active_question: `L2 (${solvedCount}/${TARGET_SOLVED}): ${challenge.title} [${selectedLanguage}]`,
        active_answer: challenge.languages[selectedLanguage].solutionCode,
      });
    }
  }, [challenge, selectedLanguage, solvedCount]);

  // Load new question code
  useEffect(() => {
    setUserCode(challenge.languages[selectedLanguage].initialCode);
    setTestResults(null);
    setFeedbackMsg("");
  }, [challenge.id, selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("dd_q_index", currentLevelIdx);
    localStorage.setItem("dd_l2_solved", solvedCount);
  }, [currentLevelIdx, solvedCount]);

  const handleKeyDown = (e) => {
    const { value, selectionStart, selectionEnd } = e.target;
    if (e.key === "Tab") {
      e.preventDefault();
      const tab = "    ";
      setUserCode(
        value.substring(0, selectionStart) +
          tab +
          value.substring(selectionEnd),
      );
      setTimeout(() => {
        if (textAreaRef.current)
          textAreaRef.current.selectionStart =
            textAreaRef.current.selectionEnd = selectionStart + 4;
      }, 0);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const currentLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const currentLine = value.substring(currentLineStart, selectionStart);
      const match = currentLine.match(/^\s*/);
      let indent = match ? match[0] : "";
      if (currentLine.trim().endsWith("{") || currentLine.trim().endsWith(":"))
        indent += "    ";
      const insertion = "\n" + indent;
      setUserCode(
        value.substring(0, selectionStart) +
          insertion +
          value.substring(selectionEnd),
      );
      setTimeout(() => {
        if (textAreaRef.current)
          textAreaRef.current.selectionStart =
            textAreaRef.current.selectionEnd =
              selectionStart + insertion.length;
      }, 0);
    }
  };

  const handleSkip = (e) => {
    e.preventDefault(); // Prevent accidental form submissions
    onPenalty(CONFIG.skipPenalty || 10);
    setFeedbackMsg("SKIPPED");

    const docId = localStorage.getItem("dd_doc_id");
    if (docId) {
      getGameConfig(pcId).then((doc) => {
        const history = doc.history_logs ? JSON.parse(doc.history_logs) : [];
        history.push({
          question: challenge.title,
          status: "SKIPPED",
          time: new Date().toLocaleTimeString(),
        });
        updateLiveGameStatus(docId, { history_logs: JSON.stringify(history) });
      });
    }

    // Fast transition (200ms)
    setTimeout(() => {
      setCurrentLevelIdx(currentLevelIdx + 1);
      setActiveTab("problem");
      setFeedbackMsg("");
    }, 200);
  };

  const handleRunTests = async (runAll = false) => {
    setIsRunning(true);
    setFeedbackMsg("");
    setActiveTab("console");
    setTestResults(null);

    const langData = challenge.languages[selectedLanguage];
    let fullSource = "";

    if (selectedLanguage === "cpp" || selectedLanguage === "java") {
      const placeholder =
        selectedLanguage === "java"
          ? "// Insert User Code Here"
          : "// Insert User Code Class Here";
      if (langData.driverCode.includes(placeholder)) {
        fullSource = langData.driverCode.replace(placeholder, userCode);
      } else {
        fullSource = userCode + "\n" + langData.driverCode;
      }
    } else {
      fullSource = userCode + "\n" + langData.driverCode;
    }

    const casesToRun = runAll
      ? challenge.testCases
      : challenge.testCases.slice(0, 1);
    const results = [];
    let allPassed = true;

    for (const testCase of casesToRun) {
      const { output, error, isError } = await executeCode(
        selectedLanguage,
        fullSource,
        testCase.input,
      );
      const cleanOutput = output ? output.replace(/\r\n/g, "\n").trim() : "";
      const cleanExpected = testCase.expected.replace(/\r\n/g, "\n").trim();

      const passed = !isError && cleanOutput === cleanExpected;
      if (!passed) allPassed = false;

      results.push({
        input: testCase.input,
        expected: cleanExpected,
        actual: cleanOutput,
        error: error,
        passed: passed,
      });
    }

    setTestResults(results);
    setIsRunning(false);

    if (runAll) handleSubmissionResult(allPassed);
  };

  const handleSubmissionResult = (passed) => {
    if (passed) {
      setFeedbackMsg("SUCCESS");
      const newSolvedCount = solvedCount + 1;
      setSolvedCount(newSolvedCount);

      const docId = localStorage.getItem("dd_doc_id");
      if (docId) {
        getGameConfig(pcId).then((doc) => {
          const history = doc.history_logs ? JSON.parse(doc.history_logs) : [];
          history.push({
            question: challenge.title,
            status: "SOLVED",
            total_solved: newSolvedCount,
            time: new Date().toLocaleTimeString(),
          });
          updateLiveGameStatus(docId, {
            history_logs: JSON.stringify(history),
          });
          if (newSolvedCount >= TARGET_SOLVED) updateTeamProgress(docId, 3, 0);
        });
      }

      // Very fast transition
      setTimeout(() => {
        if (newSolvedCount >= TARGET_SOLVED) {
          onSolve();
        } else {
          setCurrentLevelIdx(currentLevelIdx + 1);
          setActiveTab("problem");
          setFeedbackMsg("");
        }
      }, 500);
    } else {
      setFeedbackMsg("FAILED");
      onPenalty(CONFIG.incorrectPenalty || 30);
    }
  };

  return (
    <DetectiveLayout
      title={`Level 2: Debugger (${solvedCount}/${TARGET_SOLVED})`}
      timer={timerDisplay}
      penalty={onPenaltyAmount}
      onAdminReset={onAdminReset}
      pcId={pcId}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-[#0f1524] p-3 rounded-lg border border-gray-700">
            <div className="flex gap-2 items-center">
              <Trophy className="text-yellow-500" size={20} />
              <span className="text-gray-300 font-bold">Progress</span>
            </div>
            <div className="flex gap-1">
              {[...Array(TARGET_SOLVED)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-4 rounded-full ${i < solvedCount ? "bg-green-500" : "bg-gray-700"}`}
                />
              ))}
            </div>
            <span className="text-white font-mono">
              {solvedCount}/{TARGET_SOLVED}
            </span>
          </div>

          <div className="flex border-b-2 border-gray-700">
            <button
              onClick={() => setActiveTab("problem")}
              className={`px-4 py-2 font-game font-bold ${activeTab === "problem" ? "text-arcade-primary border-b-2 border-arcade-primary" : "text-gray-400"}`}
            >
              BRIEF
            </button>
            <button
              onClick={() => setActiveTab("console")}
              className={`px-4 py-2 font-game font-bold ${activeTab === "console" ? "text-arcade-accent border-b-2 border-arcade-accent" : "text-gray-400"}`}
            >
              CONSOLE
            </button>
          </div>

          <div className="bg-[#0f1524] flex-1 rounded-xl p-6 border-2 border-arcade-secondary overflow-y-auto custom-scrollbar">
            {activeTab === "problem" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-white font-bold mb-2">
                    {challenge.title}
                  </h2>
                  <div className="flex gap-2">
                    <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">
                      DEBUGGING
                    </span>
                    <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30">
                      {challenge.languages[
                        selectedLanguage
                      ].driverCode.includes("ListNode")
                        ? "DATA STRUCTURES"
                        : "ALGORITHM"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-lg whitespace-pre-line">
                  {challenge.description}
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">
                    Example Case
                  </h4>
                  {challenge.testCases.slice(0, 1).map((tc, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 mb-3 text-sm font-mono border-l-2 border-gray-600 pl-3"
                    >
                      <div className="text-gray-400">
                        Input:{" "}
                        <span className="text-white whitespace-pre-wrap">
                          {tc.input}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        Output:{" "}
                        <span className="text-arcade-success whitespace-pre-wrap">
                          {tc.expected}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-sm">
                {!testResults && !isRunning && (
                  <p className="text-gray-500 italic">Run code...</p>
                )}
                {isRunning && (
                  <div className="text-arcade-accent animate-pulse">
                    <Terminal size={16} className="inline mr-2" />
                    Running Tests...
                  </div>
                )}
                {testResults &&
                  testResults.map((res, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded border ${res.passed ? "bg-green-900/10 border-green-800" : "bg-red-900/10 border-red-800"}`}
                    >
                      <div className="flex justify-between">
                        <span
                          className={
                            res.passed ? "text-green-500" : "text-red-500"
                          }
                        >
                          Test Case {i + 1}
                        </span>
                        {res.passed ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </div>
                      {!res.passed && (
                        <div className="mt-2 text-xs text-gray-400">
                          Expected:{" "}
                          <pre className="text-gray-300">{res.expected}</pre>
                          Actual: <pre className="text-white">{res.actual}</pre>
                          {res.error && (
                            <div className="text-red-400 mt-1">{res.error}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                {feedbackMsg === "SUCCESS" && (
                  <div className="text-green-400 font-bold text-center border border-green-500 p-2 rounded bg-green-900/20">
                    PASSED
                  </div>
                )}
                {feedbackMsg === "SKIPPED" && (
                  <div className="text-yellow-400 font-bold text-center border border-yellow-500 p-2 rounded bg-yellow-900/20">
                    SKIPPING...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: EDITOR */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center h-[42px] border-b-2 border-gray-700 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Code2 size={18} />
                <span className="font-mono text-sm font-bold">Solution</span>
              </div>
              {/* FIXED: Padding Added to prevent Icon overlap */}
              <div className="relative group">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800 text-arcade-primary text-sm font-bold py-1 pl-3 pr-8 rounded border border-gray-600 focus:outline-none focus:border-arcade-primary appearance-none cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <Globe
                  size={14}
                  className="absolute right-2 top-2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <CornerDownLeft size={12} /> Auto-Indent
            </div>
          </div>

          <textarea
            ref={textAreaRef}
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full bg-[#1e1e1e] text-gray-300 font-mono text-base p-4 rounded-xl border-2 border-gray-700 focus:border-arcade-primary outline-none resize-none leading-relaxed shadow-inner custom-scrollbar"
            spellCheck="false"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              disabled={isRunning}
              className="w-16 bg-gray-800 hover:bg-gray-700 text-yellow-500 border border-gray-600 font-game font-bold rounded-xl flex justify-center items-center transition-all"
              title={`Skip Question (-${CONFIG.skipPenalty}s)`}
            >
              <SkipForward size={20} />
            </button>
            <button
              onClick={() => handleRunTests(false)}
              disabled={isRunning}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-game font-bold py-3 rounded-xl flex justify-center items-center gap-2"
            >
              <Play size={18} /> RUN
            </button>
            <button
              onClick={() => handleRunTests(true)}
              disabled={isRunning}
              className="flex-1 bg-arcade-primary hover:bg-red-500 text-white font-game font-bold py-3 rounded-xl flex justify-center items-center gap-2"
            >
              {isRunning ? (
                <Terminal size={18} className="animate-spin" />
              ) : (
                "SUBMIT"
              )}
            </button>
          </div>
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level2;
