/**
 * BTC BRAIN NEXUS
 * Multi-Timeframe Confirmation
 *
 * Compares signals from multiple timeframes.
 * Analysis only — no order execution.
 */

export class MultiTimeframe {
  constructor(options = {}) {
    this.requiredAgreement = options.requiredAgreement ?? 2;
  }

  analyze(signals = {}) {
    const validSignals = Object.entries(signals)
      .filter(([timeframe, signal]) =>
        timeframe &&
        signal &&
        ["LONG", "SHORT", "WAIT"].includes(signal.signal)
      );

    if (validSignals.length < this.requiredAgreement) {
      return {
        signal: "WAIT",
        confidence: 0,
        agreement: 0,
        reason: "Not enough timeframe signals"
      };
    }

    const longCount = validSignals.filter(
      ([, signal]) => signal.signal === "LONG"
    ).length;

    const shortCount = validSignals.filter(
      ([, signal]) => signal.signal === "SHORT"
    ).length;

    const total = validSignals.length;

    if (longCount >= this.requiredAgreement && longCount > shortCount) {
      return {
        signal: "LONG",
        confidence: Math.round((longCount / total) * 100),
        agreement: longCount,
        totalTimeframes: total,
        reason: "Multiple timeframes confirm LONG"
      };
    }

    if (shortCount >= this.requiredAgreement && shortCount > longCount) {
      return {
        signal: "SHORT",
        confidence: Math.round((shortCount / total) * 100),
        agreement: shortCount,
        totalTimeframes: total,
        reason: "Multiple timeframes confirm SHORT"
      };
    }

    return {
      signal: "WAIT",
      confidence: 0,
      agreement: Math.max(longCount, shortCount),
      totalTimeframes: total,
      reason: "Timeframe signals do not agree"
    };
  }
}
