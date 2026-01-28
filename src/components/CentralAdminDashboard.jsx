import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  Monitor,
  LogOut,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  X,
  SkipForward,
  Clock,
} from "lucide-react";
import {
  getAllTeams,
  createTeamSession,
  deleteTeam,
  subscribeToTeams,
  setTeamLockStatus,
  approveGameReset,
  triggerRemoteSkip,
} from "../appwrite";

const CentralAdminDashboard = ({ onLogout }) => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // FIX: Store ID instead of object to ensure live updates in Modal
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [newPcId, setNewPcId] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTeams = async () => {
    const data = await getAllTeams();
    setTeams(data.documents || []);
  };

  useEffect(() => {
    fetchTeams();
    // Subscribe to real-time changes
    const unsubscribe = subscribeToTeams(() => {
      fetchTeams(); // This updates the 'teams' state whenever DB changes
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTeamSession(newPcId, newPass);
      setShowModal(false);
      setNewPcId("");
      setNewPass("");
    } catch (error) {
      console.error(error);
      alert(`Failed to Activate Station. Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlock = async (docId) => {
    await setTeamLockStatus(docId, false);
  };

  const handleApproveReset = async (team) => {
    if (window.confirm(`Approve Game Reset for ${team.pc_id}?`)) {
      await approveGameReset(team.$id, team.pc_id, team.level1_password);
    }
  };

  const handleForceSkip = async (docId) => {
    if (window.confirm("Force this team to SKIP the current question?")) {
      try {
        await triggerRemoteSkip(docId);
        alert("Skip command sent.");
      } catch (error) {
        alert("Error sending skip command: " + error.message);
      }
    }
  };

  const getHistory = (team) => {
    try {
      return JSON.parse(team.history_logs || "[]");
    } catch {
      return [];
    }
  };

  // DERIVED STATE: Find the active team object from the live list
  const activeTeam = teams.find((t) => t.$id === selectedTeamId);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-game font-bold text-white">
            MASTER CONTROL
          </h1>
          <p className="text-gray-400 text-sm font-mono mt-1">
            Live Monitoring
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="btn-game flex gap-2"
          >
            <Plus /> Add Station
          </button>
          <button
            onClick={onLogout}
            className="btn-game-secondary bg-red-900/50"
          >
            <LogOut />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.$id}
            onClick={() => setSelectedTeamId(team.$id)} // Set ID only
            className={`game-card p-6 relative overflow-hidden transition-all cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(76,201,240,0.2)] ${team.is_locked || team.reset_requested ? "border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : "border-gray-700"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <Monitor
                    size={20}
                    className={
                      team.is_locked ? "text-red-500" : "text-arcade-primary"
                    }
                  />
                  {team.pc_id}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Pass: {team.level1_password}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTeam(team.$id);
                }}
                className="text-red-900 hover:text-red-500 transition-colors p-2 z-10"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Status Badges */}
            {team.reset_requested && (
              <div className="bg-blue-900/30 rounded-lg p-3 mb-4 border border-blue-500 animate-pulse flex items-center justify-between">
                <div className="text-blue-200 text-xs font-bold uppercase">
                  Reset Requested
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveReset(team);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg"
                >
                  APPROVE
                </button>
              </div>
            )}

            {team.is_locked && !team.reset_requested && (
              <div className="bg-red-900/20 rounded-lg p-3 mb-4 border border-red-500/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Lock size={16} /> LOCKED
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlock(team.$id);
                  }}
                  className="bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                >
                  <Unlock size={12} /> UNLOCK
                </button>
              </div>
            )}

            {!team.is_locked && !team.reset_requested && (
              <div className="mb-4 text-green-500 font-mono text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Level {team.current_level} Active
              </div>
            )}

            {/* Time Taken Badge in Grid Card */}
            {team.level2_completion_time && (
              <div className="mb-4 bg-yellow-900/20 border border-yellow-500/30 p-2 rounded flex items-center gap-2 justify-center">
                <Clock size={14} className="text-yellow-500" />
                <span className="text-yellow-200 text-xs font-bold">
                  TIME: {team.level2_completion_time}
                </span>
              </div>
            )}

            <div className="bg-black/30 p-3 rounded-lg flex justify-between items-center text-xs text-gray-400">
              <span>
                Solved:{" "}
                <span className="text-white font-bold">
                  {team.questions_solved || 0}
                </span>
              </span>
              <span className="flex items-center gap-1 text-arcade-success">
                <Eye size={12} /> View Live
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TEAM DETAIL MODAL */}
      {activeTeam && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="game-card w-full max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-arcade-primary">
            {/* Modal Header */}
            <div className="bg-black/40 p-6 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-4">
                <div className="bg-arcade-primary p-3 rounded-lg">
                  <Monitor size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-game font-bold text-white">
                    {activeTeam.pc_id}{" "}
                    <span className="text-gray-500 text-lg">Monitoring</span>
                  </h2>
                  <p className="text-sm text-gray-400 font-mono">
                    Session ID: {activeTeam.$id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeamId(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT: Live State */}
              <div className="space-y-6">
                {activeTeam.level2_completion_time ? (
                  // --- COMPLETED STATE: Show ONLY Time ---
                  <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in py-10">
                    <div className="bg-yellow-900/10 border-2 border-yellow-500/50 p-8 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.1)] text-center w-full transform hover:scale-105 transition-transform">
                      <Clock
                        size={48}
                        className="text-yellow-500 mx-auto mb-4 animate-pulse"
                      />
                      <p className="text-sm text-yellow-500 font-bold uppercase tracking-widest mb-2">
                        Level 2 Completed In
                      </p>
                      <p className="text-6xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        {activeTeam.level2_completion_time}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 text-center opacity-70">
                        <p className="text-2xl font-bold text-white">
                          {activeTeam.current_level}
                        </p>
                        <p className="text-xs text-blue-300 uppercase">
                          Current Level
                        </p>
                      </div>
                      <div className="bg-green-900/20 p-4 rounded-lg border border-green-900/50 text-center opacity-70">
                        <p className="text-2xl font-bold text-white">
                          {activeTeam.questions_solved}
                        </p>
                        <p className="text-xs text-green-300 uppercase">
                          Solved
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // --- ACTIVE STATE: Show Questions ---
                  <>
                    <h3 className="text-xl font-game text-arcade-accent uppercase tracking-widest border-b border-gray-700 pb-2">
                      Active Challenge
                    </h3>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 transition-all">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                        Current Question
                      </p>
                      <p className="text-lg text-white font-mono leading-relaxed animate-fade-in">
                        {activeTeam.active_question ||
                          "Waiting for level start..."}
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500 uppercase font-bold">
                          Expected Answer
                        </p>
                        <button
                          onClick={() => handleForceSkip(activeTeam.$id)}
                          className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white text-xs px-2 py-1 rounded border border-red-500/50 flex items-center gap-1 transition-all"
                          title="Force user to skip this question"
                        >
                          <SkipForward size={12} /> FORCE SKIP
                        </button>
                      </div>
                      <pre className="text-xs text-arcade-success font-mono font-bold whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                        {activeTeam.active_answer || "---"}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 text-center">
                        <p className="text-2xl font-bold text-white">
                          {activeTeam.current_level}
                        </p>
                        <p className="text-xs text-blue-300 uppercase">
                          Current Level
                        </p>
                      </div>
                      <div className="bg-green-900/20 p-4 rounded-lg border border-green-900/50 text-center">
                        <p className="text-2xl font-bold text-white">
                          {activeTeam.questions_solved}
                        </p>
                        <p className="text-xs text-green-300 uppercase">
                          Solved
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT: History Log */}
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-game text-gray-400 uppercase tracking-widest border-b border-gray-700 pb-2 mb-4">
                  Activity Log
                </h3>

                <div className="flex-1 bg-black/30 rounded-xl p-4 overflow-y-auto custom-scrollbar border border-gray-800">
                  {getHistory(activeTeam).length === 0 ? (
                    <p className="text-gray-600 text-center italic mt-10">
                      No activity recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {[...getHistory(activeTeam)].reverse().map((log, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800/80 p-3 rounded-lg border-l-4 border-arcade-primary animate-slide-in"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${log.status === "SOLVED" ? "bg-green-900 text-green-400" : log.status === "SKIPPED" || log.status.includes("SKIPPED") ? "bg-yellow-900 text-yellow-400" : "bg-red-900 text-red-400"}`}
                            >
                              {log.status}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {log.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {log.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add PC Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAdd} className="game-card p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Assign New PC
            </h2>
            <input
              className="input-game mb-4"
              placeholder="PC ID (e.g. PC-05)"
              value={newPcId}
              onChange={(e) => setNewPcId(e.target.value)}
              required
            />
            <input
              className="input-game mb-6"
              placeholder="Level 1 Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-game-secondary w-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-game w-full"
              >
                {isSubmitting ? "Activating..." : "Activate"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CentralAdminDashboard;
