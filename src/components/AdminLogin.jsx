import React, { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { account } from "../appwrite";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Attempt session creation
      try {
        await account.get();
      } catch {
        await account.createEmailPasswordSession(email, password);
      }
      localStorage.setItem("dd_admin_auth_proof", password);
      localStorage.setItem("dd_admin_email", email);
      onLoginSuccess();
    } catch (err) {
      setError("Invalid Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="game-card p-8 w-full max-w-md bg-arcade-card">
        <div className="flex justify-center mb-6">
          <div className="bg-arcade-secondary p-4 rounded-full shadow-lg">
            <Shield size={40} className="text-arcade-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-game font-bold text-center text-white mb-8">
          Admin <span className="text-arcade-primary">Portal</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-game"
            placeholder="Admin Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-game"
            placeholder="Password"
            required
          />

          {error && (
            <p className="text-red-500 font-bold text-center text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-game w-full flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
