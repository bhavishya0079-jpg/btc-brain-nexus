/**
 * BTC BRAIN NEXUS
 * Chart Engine
 *
 * Lightweight chart integration.
 * Displays market data only.
 */

export class ChartEngine {
  constructor() {
    this.chart = null;
    this.candleSeries = null;
    this.volumeSeries = null;
    this.container = null;
  }

  initialize(container, library) {
    if (!container) {
      throw new Error("Chart container is required");
    }

    if (!library || typeof library.createChart !== "function") {
      throw new Error("Lightweight Charts library is not loaded");
    }

    this.destroy();

    this.container = container;

    this.chart = library.createChart(container, {
      width: container.clientWidth,
      height: 450,
      layout: {
        background: { color: "#0b1220" },
        textColor: "#cbd5e1"
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" }
      },
      rightPriceScale: {
        borderColor: "#334155"
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
        secondsVisible: false
      },
      crosshair: {
        mode: 0
      }
    });

    this.candleSeries = this.chart.addSeries(
      library.CandlestickSeries,
      {
        upColor: "#00c087",
        downColor: "#ff4d6d",
        borderUpColor: "#00c087",
        borderDownColor: "#ff4d6d",
        wickUpColor: "#00c087",
        wickDownColor: "#ff4d6d"
      }
    );

    return this.chart;
  }

  setCandles(candles) {
    if (!this.candleSeries) {
      throw new Error("Chart is not initialized");
    }

    if (!Array.isArray(candles)) {
      throw new Error("Invalid candle data");
    }

    const data = candles.map(candle => ({
      time: Math.floor(candle.time / 1000),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    }));

    this.candleSeries.setData(data);
  }

  addCandle(candle) {
    if (!this.candleSeries) {
      throw new Error("Chart is not initialized");
    }

    this.candleSeries.update({
      time: Math.floor(candle.time / 1000),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    });
  }

  resize() {
    if (!this.chart || !this.container) return;

    this.chart.applyOptions({
      width: this.container.clientWidth
    });
  }

  destroy() {
    if (this.chart) {
      this.chart.remove();
    }

    this.chart = null;
    this.candleSeries = null;
    this.volumeSeries = null;
  }
}
