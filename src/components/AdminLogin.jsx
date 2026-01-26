import React, { useState } from "react";
import { Shield, Loader2, Monitor, Lock } from "lucide-react";
import { verifyMasterPassword } from "../appwrite";

const AdminLogin = ({ onStationLogin, onMasterLogin }) => {
  const [mode, setMode] = useState("STATION");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "STATION") {
      onStationLogin(inputVal);
    } else {
      const isValid = await verifyMasterPassword(inputVal);
      if (isValid) {
        onMasterLogin();
      } else {
        setError("Invalid Master Key");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="game-card p-8 w-full max-w-md bg-arcade-card relative">
        <button
          onClick={() => {
            setMode(mode === "STATION" ? "MASTER" : "STATION");
            setInputVal("");
            setError("");
          }}
          className="absolute top-4 right-4 text-xs font-mono text-gray-500 hover:text-white flex items-center gap-1"
        >
          {mode === "STATION" ? <Lock size={12} /> : <Monitor size={12} />}
          {mode === "STATION" ? "Admin Access" : "Station Login"}
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-arcade-secondary p-4 rounded-full shadow-lg">
            {mode === "STATION" ? (
              <Monitor size={40} className="text-arcade-primary" />
            ) : (
              <Shield size={40} className="text-red-500" />
            )}
          </div>
        </div>

        <h1 className="text-3xl font-game font-bold text-center text-white mb-2">
          {mode === "STATION" ? "STATION" : "MASTER"}{" "}
          <span className="text-arcade-primary">VX</span>
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8 font-mono">
          {mode === "STATION"
            ? "Enter Assigned PC ID"
            : "Enter Database Access Key"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type={mode === "STATION" ? "text" : "password"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="input-game text-center text-lg tracking-widest"
            placeholder={mode === "STATION" ? "PC-01" : "••••••••"}
            required
            autoFocus
          />
          {error && (
            <p className="text-red-500 font-bold text-center text-sm animate-pulse">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`btn-game w-full flex justify-center items-center ${mode === "MASTER" ? "border-red-500 text-red-100 bg-red-900/20 hover:bg-red-900/50" : ""}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : mode === "STATION" ? (
              "Initialize"
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
