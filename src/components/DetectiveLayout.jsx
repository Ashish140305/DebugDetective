import React from "react";
import { Terminal, Zap } from "lucide-react";

const DetectiveLayout = ({ children, title, HZ, timer, penalty }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Simple White Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 text-white p-1.5 rounded-md">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Debug Detective
            </span>
          </div>

          <div className="flex items-center gap-4">
            {timer && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Time Left
                </span>
                <span className="font-mono text-xl font-bold text-blue-600">
                  {timer}
                </span>
              </div>
            )}

            {penalty > 0 && (
              <div className="flex items-center gap-1 text-red-600 font-bold animate-bounce bg-red-50 px-2 py-1 rounded">
                <Zap size={16} /> -{penalty}s
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DetectiveLayout;
