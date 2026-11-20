/**
 * BTC BRAIN NEXUS
 * Signal Quality Filters
 *
 * Filters weak and unconfirmed signals.
 */

export class SignalFilters {
  constructor(options = {}) {
    this.minVolumeRatio = options.minVolumeRatio ?? 1;
    this.minConfidence = options.minConfidence ?? 60;
  }

  checkVolume(candles, lookback = 20) {
    if (!Array.isArray(candles) || candles.length <= lookback) {
      return {
        passed: false,
        reason: "Not enough volume history"
      };
    }

    const recent = candles[candles.length - 1];
    const previous = candles.slice(-lookback - 1, -1);

    const average =
      previous.reduce(
        (sum, candle) => sum + Number(candle.volume || 0),
        0
      ) / lookback;

    const ratio = average > 0
      ? Number(recent.volume || 0) / average
      : 0;

    return {
      passed: ratio >= this.minVolumeRatio,
      ratio,
      reason: ratio >= this.minVolumeRatio
        ? "Volume confirmation passed"
        : "Volume is below required average"
    };
  }

  checkTrend(fastEMA, slowEMA, signal) {
    if (
      !Number.isFinite(fastEMA) ||
      !Number.isFinite(slowEMA)
    ) {
      return {
        passed: false,
        reason: "EMA data unavailable"
      };
    }

    const passed =
      signal === "LONG"
        ? fastEMA > slowEMA
        : signal === "SHORT"
          ? fastEMA < slowEMA
          : false;

    return {
      passed,
      reason: passed
        ? "Trend confirmation passed"
        : "Trend does not confirm signal"
    };
  }

  checkRiskReward(entry, stopLoss, target, minimum = 1.5) {
    if (![entry, stopLoss, target].every(Number.isFinite)) {
      return {
        passed: false,
        reason: "Invalid entry, stop loss or target"
      };
    }

    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(target - entry);

    if (risk <= 0) {
      return {
        passed: false,
        reason: "Invalid risk distance"
      };
    }

    const ratio = reward / risk;

    return {
      passed: ratio >= minimum,
      ratio,
      reason: ratio >= minimum
        ? "Risk/reward requirement passed"
        : "Risk/reward is too low"
    };
  }

  evaluate(checks = []) {
    const failed = checks.filter(check => !check.passed);

    return {
      approved: checks.length > 0 && failed.length === 0,
      passed: checks.length - failed.length,
      failed: failed.length,
      reasons: failed.map(check => check.reason)
    };
  }
}
