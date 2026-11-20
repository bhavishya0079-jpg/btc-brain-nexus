/**
 * BTC BRAIN NEXUS
 * Market Regime Detector
 *
 * Detects trending, ranging and volatile markets.
 * Analysis only — no order execution.
 */

export class MarketRegime {
  detect(candles = []) {
    if (!Array.isArray(candles) || candles.length < 20) {
      return {
        regime: "UNKNOWN",
        confidence: 0,
        reason: "Not enough candle data"
      };
    }

    const valid = candles.every(c =>
      Number.isFinite(Number(c.open)) &&
      Number.isFinite(Number(c.high)) &&
      Number.isFinite(Number(c.low)) &&
      Number.isFinite(Number(c.close)) &&
      Number(c.high) >= Number(c.low)
    );

    if (!valid) {
      return {
        regime: "UNKNOWN",
        confidence: 0,
        reason: "Invalid candle data"
      };
    }

    const closes = candles.map(c => Number(c.close));
    const highs = candles.map(c => Number(c.high));
    const lows = candles.map(c => Number(c.low));

    const recent = closes.slice(-20);
    const first = recent[0];
    const last = recent[recent.length - 1];

    const changePercent = Math.abs((last - first) / first) * 100;

    const ranges = highs.slice(-20).map((high, i) => {
      const low = lows.slice(-20)[i];
      return ((high - low) / Math.max(low, 0.00000001)) * 100;
    });

    const averageRange =
      ranges.reduce((sum, value) => sum + value, 0) / ranges.length;

    const direction = last > first ? "UP" : "DOWN";

    if (averageRange > 1.5) {
      return {
        regime: "VOLATILE",
        direction,
        confidence: Math.min(95, 60 + averageRange * 5),
        reason: "Large average candle range"
      };
    }

    if (changePercent > 1) {
      return {
        regime: "TRENDING",
        direction,
        confidence: Math.min(95, 60 + changePercent * 5),
        reason: "Price movement shows a directional trend"
      };
    }

    return {
      regime: "RANGING",
      direction: "SIDEWAYS",
      confidence: 70,
      reason: "Price movement is relatively narrow"
    };
  }
}
