/**
 * BTC BRAIN NEXUS
 * Chart Controls
 */

export class ChartControls {
  constructor(chartEngine) {
    this.chartEngine = chartEngine;
    this.timeframes = [
      "1m", "3m", "5m", "15m",
      "30m", "1h", "4h", "1d"
    ];

    this.activeTimeframe = "5m";
    this.onTimeframeChange = null;
  }

  setTimeframe(timeframe) {
    if (!this.timeframes.includes(timeframe)) {
      throw new Error("Unsupported timeframe");
    }

    this.activeTimeframe = timeframe;

    if (typeof this.onTimeframeChange === "function") {
      this.onTimeframeChange(timeframe);
    }

    return timeframe;
  }

  setCallback(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    this.onTimeframeChange = callback;
  }

  getTimeframes() {
    return [...this.timeframes];
  }

  getActiveTimeframe() {
    return this.activeTimeframe;
  }

  fitContent() {
    const chart = this.chartEngine?.chart;

    if (chart) {
      chart.timeScale().fitContent();
    }
  }

  setVisibleRange(from, to) {
    const chart = this.chartEngine?.chart;

    if (!chart) {
      throw new Error("Chart is not initialized");
    }

    chart.timeScale().setVisibleRange({
      from,
      to
    });
  }
}
