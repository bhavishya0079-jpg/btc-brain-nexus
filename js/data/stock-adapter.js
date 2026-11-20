/**
 * BTC BRAIN NEXUS
 * Indian Stock Market Data Adapter
 *
 * Supports NSE/BSE data through a configured backend.
 * No scraping, broker connection or order execution.
 */

export class StockAdapter {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "";
    this.name = "Indian Market Data";
    this.exchange = options.exchange || "NSE";
  }

  async getCandles(symbol, timeframe = "5m", limit = 100) {
    if (!this.baseUrl) {
      throw new Error(
        "Indian market data provider is not configured. " +
        "Connect a permitted NSE/BSE data provider first."
      );
    }

    const allowedTimeframes = [
      "1m", "3m", "5m", "15m",
      "30m", "1h", "4h", "1d"
    ];

    if (!allowedTimeframes.includes(timeframe)) {
      throw new Error("Unsupported timeframe");
    }

    const safeSymbol = String(symbol)
      .trim()
      .toUpperCase();

    if (!/^[A-Z0-9_-]{1,30}$/.test(safeSymbol)) {
      throw new Error("Invalid market symbol");
    }

    const safeLimit = Math.min(
      Math.max(Number(limit) || 100, 1),
      1000
    );

    const url = new URL(
      `${this.baseUrl.replace(/\/$/, "")}/market/candles`
    );

    url.searchParams.set("symbol", safeSymbol);
    url.searchParams.set("exchange", this.exchange);
    url.searchParams.set("timeframe", timeframe);
    url.searchParams.set("limit", String(safeLimit));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Indian market data error: HTTP ${response.status}`
      );
    }

    const result = await response.json();

    if (!result || !Array.isArray(result.candles)) {
      throw new Error("Invalid Indian market data response");
    }

    return result.candles.map(candle => ({
      time: Number(candle.time),
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
      volume: Number(candle.volume || 0)
    }));
  }
}
