import React, { useState } from "react";
import { ShieldCheck, Loader2, Moon, Sun } from "lucide-react";
import { account } from "../appwrite";
import { useTheme } from "../context/ThemeContext";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Check for existing session first to avoid "Session Active" error
      try {
        await account.get();
        // If successful, we are already logged in.
      } catch (err) {
        // If failed, we need to login
        await account.createEmailPasswordSession(email, password);
      }

      // 2. STORE CREDENTIALS IN LOCALSTORAGE (PERSISTENT)
      // This allows "New Game" verification to work across refreshes/tabs
      localStorage.setItem("dd_admin_auth_proof", password);
      localStorage.setItem("dd_admin_email", email);

      onLoginSuccess();
    } catch (err) {
      console.error("Login Error:", err);
      // Appwrite throws 401 for bad pass, 409 for duplicate session (handled above)
      if (err.code === 401) {
        setError("Invalid Email or Password.");
      } else {
        setError(err.message || "Connection Error.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full text-white">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Organizer Access
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Log in to configure this terminal.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@debugdetective.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
