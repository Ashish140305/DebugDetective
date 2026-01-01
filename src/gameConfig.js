export const CONFIG = {
  pcId: "PC-01",
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
  questionsToSolve: 10, // Requirement: 10 correctly answered questions
  incorrectPenalty: 30, // Requirement: -30s for incorrect answers
  skipPenalty: 15,      // Requirement: -15s for skipped questions
  // Phase 3
  researchTopics: [
    "APIs and Web Architecture",
    "Data Structures in Modern Software",
    "Debugging Complex Systems",
    "Performance Optimization Techniques"
  ]
};