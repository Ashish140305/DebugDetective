import React from "react";
import { Terminal, Zap, Settings } from "lucide-react";

const DetectiveLayout = ({ children, title, timer, penalty, onAdminReset }) => {
  const handleAdminClick = () => {
    // Simple prompt for now, or pass a handler from App.jsx to show modal
    if (
      window.confirm(
        "Admin Access: Do you want to reset this terminal for a NEW game?"
      )
    ) {
      // Trigger the reset flow
      if (onAdminReset) onAdminReset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-800">
              Debug Detective
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {penalty > 0 && (
              <div className="flex items-center gap-1 text-red-600 font-bold animate-bounce bg-red-50 px-2 py-1 rounded">
                <Zap size={16} /> -{penalty}s
              </div>
            )}

            {timer && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Time
                </span>
                <span className="font-mono text-xl font-bold text-blue-600">
                  {timer}
                </span>
              </div>
            )}

            {/* Admin Reset Button */}
            {onAdminReset && (
              <button
                onClick={handleAdminClick}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                title="Admin Setup"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DetectiveLayout;
