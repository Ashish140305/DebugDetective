export const CONFIG = {
  pcId: "PC-01",

  // --- NEW: SYSTEM LOGIN CONFIG ---
  systemLoginPassword: "admin", // The password required to enter the app

  // Phase 1: Detective Password Discovery Challenge
  passwordPool: [
    {
      password: "MATCH",
      hints: ["I can be struck but never feel pain", "I have a head but no brain", "I am useful only when I am lit"]
    },
    {
      password: "SHADOW",
      hints: ["I am only there when the sun shines", "I follow you but have no feet", "I am tall in the morning and short at noon"]
    },
    {
      password: "CLOCK",
      hints: ["I have hands but cannot clap", "I have a face but no eyes", "I tell the truth without speaking"]
    }
  ],
  // Phase 2: Interrogation Mechanics
  questionsToSolve: 10,
  incorrectPenalty: 30,
  skipPenalty: 15,
  // Phase 3
  researchTopics: [
    "APIs and Web Architecture",
    "Data Structures in Modern Software",
    "Debugging Complex Systems",
    "Performance Optimization Techniques"
  ]
};