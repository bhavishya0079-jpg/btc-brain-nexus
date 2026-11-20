/**
 * BTC BRAIN NEXUS
 * News Sentiment Analyzer
 *
 * Basic keyword-based news sentiment.
 * This is not a live news feed.
 * No trading or order execution.
 */

export class NewsSentiment {
  constructor() {
    this.positiveWords = [
      "surge", "rally", "gain", "growth",
      "bullish", "positive", "adoption",
      "approval", "突破", "rise", "upgrade"
    ];

    this.negativeWords = [
      "crash", "drop", "fall", "loss",
      "bearish", "negative", "hack",
      "ban", "lawsuit", "decline", "risk"
    ];
  }

  analyze(text = "") {
    if (typeof text !== "string" || !text.trim()) {
      return {
        sentiment: "UNKNOWN",
        score: 0,
        reason: "News text is empty"
      };
    }

    const content = text.toLowerCase();

    let positive = 0;
    let negative = 0;

    for (const word of this.positiveWords) {
      if (content.includes(word.toLowerCase())) {
        positive++;
      }
    }

    for (const word of this.negativeWords) {
      if (content.includes(word.toLowerCase())) {
        negative++;
      }
    }

    const score = positive - negative;

    let sentiment = "NEUTRAL";

    if (score > 0) {
      sentiment = "POSITIVE";
    } else if (score < 0) {
      sentiment = "NEGATIVE";
    }

    return {
      sentiment,
      score,
      positiveMatches: positive,
      negativeMatches: negative,
      reason: "Basic keyword analysis only"
    };
  }
}
