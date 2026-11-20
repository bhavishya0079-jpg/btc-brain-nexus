/**
 * BTC BRAIN NEXUS
 * Support & Resistance Detector
 *
 * Finds possible price support and resistance levels.
 * Analysis only — no order execution.
 */

export class SupportResistance {
  detect(candles = [], lookback = 50) {
    if (!Array.isArray(candles) || candles.length < 10) {
      return {
        support: null,
        resistance: null,
        reason: "Not enough candle data"
      };
    }

    const count = Math.max(10, Math.floor(lookback));
    const recent = candles.slice(-count);

    const valid = recent.every(c =>
      Number.isFinite(Number(c.high)) &&
      Number.isFinite(Number(c.low)) &&
      Number(c.high) >= Number(c.low)
    );

    if (!valid) {
      return {
        support: null,
        resistance: null,
        reason: "Invalid candle data"
      };
    }

    const lows = recent.map(c => Number(c.low));
    const highs = recent.map(c => Number(c.high));

    const support = Math.min(...lows);
    const resistance = Math.max(...highs);

    return {
      support,
      resistance,
      range: resistance - support,
      reason: "Levels based on recent candle extremes"
    };
  }
}
