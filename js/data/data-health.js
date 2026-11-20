/**
 * BTC BRAIN NEXUS
 * Market Data Health Monitor
 *
 * Checks market data freshness and quality.
 * No broker connection or order execution.
 */

export class DataHealth {
  constructor(options = {}) {
    this.maxAgeMs = options.maxAgeMs ?? 60000;
  }

  check(data, receivedAt = Date.now()) {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        status: "NO_DATA",
        healthy: false,
        reason: "No market data available"
      };
    }

    if (
      !Number.isFinite(receivedAt) ||
      receivedAt <= 0
    ) {
      return {
        status: "INVALID",
        healthy: false,
        reason: "Invalid received timestamp"
      };
    }

    const age = Date.now() - receivedAt;

    if (age < 0) {
      return {
        status: "INVALID",
        healthy: false,
        reason: "Timestamp is in the future"
      };
    }

    if (age > this.maxAgeMs) {
      return {
        status: "STALE",
        healthy: false,
        ageMs: age,
        reason: "Market data is outdated"
      };
    }

    return {
      status: "HEALTHY",
      healthy: true,
      ageMs: age,
      candleCount: data.length,
      reason: "Market data is fresh"
    };
  }
}
