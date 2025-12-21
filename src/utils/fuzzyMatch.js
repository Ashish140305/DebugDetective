// A simple implementation of Levenshtein Distance for fuzzy matching
export const checkSimilarity = (userAnswer, correctAnswer, threshold = 0.8) => {
    const s1 = userAnswer.toLowerCase().trim();
    const s2 = correctAnswer.toLowerCase().trim();
  
    if (s1 === s2) return true;
  
    const len1 = s1.length;
    const len2 = s2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return true;
  
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
  
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
  
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
  
    const distance = matrix[len2][len1];
    const similarity = 1 - distance / maxLen;
  
    return similarity >= threshold;
  };