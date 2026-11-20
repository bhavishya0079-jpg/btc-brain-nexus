/**
 * BTC BRAIN NEXUS
 * Volume Analysis
 *
 * Compares recent volume with its average.
 * Analysis only — no order execution.
 */

export class VolumeAnalysis {
  analyze(candles = [], period = 20) {
    if (!Array.isArray(candles) || candles.length < period + 1) {
      return {
        status: "UNKNOWN",
        currentVolume: null,
        averageVolume: null,
        reason: "Not enough candle data"
      };
    }

    const recent = candles.slice(-(period + 1));

    const valid = recent.every(c =>
      Number.isFinite(Number(c.volume)) &&
      Number(c.volume) >= 0
    );

    if (!valid) {
      return {
        status: "UNKNOWN",
        currentVolume: null,
        averageVolume: null,
        reason: "Invalid volume data"
      };
    }

    const currentVolume = Number(recent[recent.length - 1].volume);

    const previousVolumes = recent
      .slice(0, -1)
      .map(c => Number(c.volume));

    const averageVolume =
      previousVolumes.reduce((sum, value) => sum + value, 0) /
      previousVolumes.length;

    if (averageVolume === 0) {
      return {
        status: "UNKNOWN",
        currentVolume,
        averageVolume,
        reason: "Average volume is zero"
      };
    }

    const ratio = currentVolume / averageVolume;

    let status = "NORMAL";

    if (ratio >= 1.5) {
      status = "HIGH";
    } else if (ratio <= 0.5) {
      status = "LOW";
    }

    return {
      status,
      currentVolume,
      averageVolume,
      ratio: Number(ratio.toFixed(2)),
      reason: `Current volume is ${ratio.toFixed(2)} times the average`
    };
  }
}
