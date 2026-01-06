export const CONFIG = {
  pcId: "PC-01",

  // --- LOGIN CREDENTIALS ---
  systemLoginPassword: "admin", // <--- CHANGE THIS for security

  unlockPin: "7749", // Level 1 Password

  // Level 1: Password Discovery Pool
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

  // Level 2 Settings
  questionsToSolve: 10,
  incorrectPenalty: 30,
  skipPenalty: 15,

  // Level 3 Topics
  researchTopics: [
    "APIs and Web Architecture",
    "Data Structures in Modern Software",
    "Debugging Complex Systems",
    "Performance Optimization Techniques",
    "The Ethics of Artificial Intelligence",
    "Cloud Computing Security Standards"
  ]
};