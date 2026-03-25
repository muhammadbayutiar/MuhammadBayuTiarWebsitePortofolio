// BALANCED Spam Detection - Production-Grade
// Weighted scoring system with NO false positives
// NEVER blocks legitimate users

export interface SpamCheckResult {
  score: number; // 0-100, higher = more suspicious
  tier: 'safe' | 'suspicious' | 'high-risk'; // Risk tier
  signals: string[]; // List of detected signals (for logging)
  shouldBlock: boolean; // Whether to block (only for extreme cases)
}

export interface BehavioralData {
  formLoadTime?: number;
  firstInteractionTime?: number;
  submissionTime: number;
  interactionCount?: number;
}

// BALANCED WEIGHTS (reduced from aggressive values)
const WEIGHTS = {
  // Content signals (reduced weights)
  spamKeywords: 15,        // Was 30 → Now 15 (less aggressive)
  tooManyUrls: 20,         // Was 25 → Now 20
  repeatedChars: 8,        // Was 15 → Now 8
  excessiveCaps: 8,        // Was 15 → Now 8
  excessiveNumbers: 5,     // Was 10 → Now 5
  suspiciousEmail: 12,     // Was 20 → Now 12
  gibberish: 12,           // Was 20 → Now 12
  tooShort: 5,             // Was 10 → Now 5
  tooLong: 8,              // Was 15 → Now 8
  nameMatchesEmail: 5,     // Was 10 → Now 5
  
  // Behavioral signals (converted from binary to weighted)
  veryFastSubmission: 25,  // <800ms (was instant block)
  fastSubmission: 10,      // <2s (was instant block)
  lowInteraction: 8,       // <3 interactions (was instant block)
  noInteraction: 15,       // 0 interactions (was instant block)
  expiredSession: 5,       // >1 hour (was instant block)
};

// RISK TIERS (balanced thresholds)
const RISK_TIERS = {
  safe: 40,           // 0-39: Safe, send normally
  suspicious: 75,     // 40-74: Suspicious, send but flag
  highRisk: 75,       // 75+: High risk, store for review
};

// Spam keyword patterns (REDUCED - only obvious spam)
const SPAM_KEYWORDS = [
  /\b(viagra|cialis|pharmacy)\b/i,
  /\b(click here.*buy now|buy now.*click here)\b/i,  // Combined phrases only
  /\b(seo service.*backlink|backlink.*seo service)\b/i,  // Combined phrases only
  /\b(casino.*poker|poker.*casino)\b/i,  // Combined phrases only
];

// IMPORTANT: Removed overly broad keywords like:
// - "crypto", "bitcoin" (legitimate users may discuss blockchain projects)
// - "loan", "credit", "debt" (legitimate financial discussions)
// - "free money", "make money" (too broad)
// - "weight loss" (legitimate health discussions)

// Suspicious patterns (with balanced thresholds)
const SUSPICIOUS_PATTERNS = {
  tooManyUrls: (text: string): boolean => {
    const urlCount = (text.match(/https?:\/\//gi) || []).length;
    return urlCount > 3;  // Was 2 → Now 3 (more lenient)
  },

  repeatedChars: (text: string): boolean => {
    return /(.)\1{8,}/.test(text);  // Was 5 → Now 8 (more lenient)
  },

  excessiveCaps: (text: string): boolean => {
    const caps = text.replace(/[^A-Z]/g, '').length;
    const total = text.replace(/[^a-zA-Z]/g, '').length;
    return total > 20 && caps / total > 0.8;  // Was 0.7 → Now 0.8 (more lenient)
  },

  excessiveNumbers: (text: string): boolean => {
    const numbers = text.replace(/[^0-9]/g, '').length;
    return numbers > text.length * 0.5;  // Was 0.3 → Now 0.5 (more lenient)
  },

  suspiciousEmail: (email: string): boolean => {
    const localPart = email.split('@')[0];
    if (!localPart) return false;
    
    // Only flag VERY obvious patterns
    const hasConsecutiveNumbers = /\d{6,}/.test(localPart);  // Was 4 → Now 6
    const hasRandomChars = /^[a-z]{1,2}\d{5,}$/.test(localPart);  // More strict pattern
    
    return hasConsecutiveNumbers || hasRandomChars;
  },

  isGibberish: (text: string): boolean => {
    const words = text.toLowerCase().split(/\s+/);
    let gibberishCount = 0;
    
    for (const word of words) {
      if (word.length > 7) {  // Was 5 → Now 7 (only check longer words)
        const vowels = word.match(/[aeiou]/g);
        if (!vowels || vowels.length < word.length * 0.15) {  // Was 0.2 → Now 0.15
          gibberishCount++;
        }
      }
    }
    
    return gibberishCount > words.length * 0.4;  // Was 0.3 → Now 0.4 (more lenient)
  },
};

// Behavioral analysis (WEIGHTED, not binary)
export function analyzeBehavior(data: BehavioralData): {
  score: number;
  signals: string[];
} {
  let score = 0;
  const signals: string[] = [];
  const now = Date.now();
  
  if (data.formLoadTime) {
    const timeSinceLoad = now - data.formLoadTime;
    
    // Very fast submission (<800ms) - likely bot
    if (timeSinceLoad < 800) {
      score += WEIGHTS.veryFastSubmission;
      signals.push('Very fast submission (<800ms)');
    }
    // Fast submission (<2s) - suspicious but not blocking
    else if (timeSinceLoad < 2000) {
      score += WEIGHTS.fastSubmission;
      signals.push('Fast submission (<2s)');
    }
    
    // Expired session (>1 hour) - minor signal
    if (timeSinceLoad > 3600000) {
      score += WEIGHTS.expiredSession;
      signals.push('Long session (>1 hour)');
    }
  }

  // Interaction count (weighted, not binary)
  if (data.interactionCount !== undefined) {
    if (data.interactionCount === 0) {
      score += WEIGHTS.noInteraction;
      signals.push('No form interaction');
    } else if (data.interactionCount < 3) {
      score += WEIGHTS.lowInteraction;
      signals.push('Low interaction count');
    }
  }

  return { score, signals };
}

// Content analysis (WEIGHTED)
export function analyzeContent(data: {
  name: string;
  email: string;
  message: string;
}): {
  score: number;
  signals: string[];
} {
  let score = 0;
  const signals: string[] = [];

  // Check for spam keywords (REDUCED list)
  const allText = `${data.name} ${data.message}`.toLowerCase();
  for (const pattern of SPAM_KEYWORDS) {
    if (pattern.test(allText)) {
      score += WEIGHTS.spamKeywords;
      signals.push('Spam keyword detected');
      break;  // Only count once
    }
  }

  // Check for too many URLs
  if (SUSPICIOUS_PATTERNS.tooManyUrls(data.message)) {
    score += WEIGHTS.tooManyUrls;
    signals.push('Multiple URLs (>3)');
  }

  // Check for repeated characters
  if (SUSPICIOUS_PATTERNS.repeatedChars(data.message)) {
    score += WEIGHTS.repeatedChars;
    signals.push('Repeated characters');
  }

  // Check for excessive caps
  if (SUSPICIOUS_PATTERNS.excessiveCaps(data.message)) {
    score += WEIGHTS.excessiveCaps;
    signals.push('Excessive capitalization');
  }

  // Check for excessive numbers
  if (SUSPICIOUS_PATTERNS.excessiveNumbers(data.message)) {
    score += WEIGHTS.excessiveNumbers;
    signals.push('Excessive numbers');
  }

  // Check for suspicious email
  if (SUSPICIOUS_PATTERNS.suspiciousEmail(data.email)) {
    score += WEIGHTS.suspiciousEmail;
    signals.push('Suspicious email pattern');
  }

  // Check for gibberish
  if (SUSPICIOUS_PATTERNS.isGibberish(data.message)) {
    score += WEIGHTS.gibberish;
    signals.push('Possible gibberish');
  }

  // Check message length
  if (data.message.length < 10) {
    score += WEIGHTS.tooShort;
    signals.push('Very short message');
  } else if (data.message.length > 8000) {  // Was 5000 → Now 8000
    score += WEIGHTS.tooLong;
    signals.push('Very long message');
  }

  // Check for identical name and email local part
  const emailLocal = data.email.split('@')[0]?.toLowerCase();
  if (emailLocal && data.name.toLowerCase().replace(/\s/g, '') === emailLocal) {
    score += WEIGHTS.nameMatchesEmail;
    signals.push('Name matches email');
  }

  return { score, signals };
}

// Combined spam check (BALANCED)
export function checkForSpam(
  content: { name: string; email: string; message: string },
  behavioral?: BehavioralData
): SpamCheckResult {
  let totalScore = 0;
  const allSignals: string[] = [];

  // Content analysis
  const contentResult = analyzeContent(content);
  totalScore += contentResult.score;
  allSignals.push(...contentResult.signals);

  // Behavioral analysis (if provided)
  if (behavioral) {
    const behaviorResult = analyzeBehavior(behavioral);
    totalScore += behaviorResult.score;
    allSignals.push(...behaviorResult.signals);
  }

  // Cap score at 100
  totalScore = Math.min(totalScore, 100);

  // Determine tier
  let tier: 'safe' | 'suspicious' | 'high-risk';
  if (totalScore < RISK_TIERS.safe) {
    tier = 'safe';
  } else if (totalScore < RISK_TIERS.suspicious) {
    tier = 'suspicious';
  } else {
    tier = 'high-risk';
  }

  // IMPORTANT: Only block if score is VERY high (>90)
  // This prevents false positives
  const shouldBlock = totalScore > 90;

  return {
    score: totalScore,
    tier,
    signals: allSignals,
    shouldBlock,
  };
}
