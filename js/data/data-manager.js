/**
 * BTC BRAIN NEXUS
 * Central Market Data Manager
 *
 * Normalizes market data from different providers.
 * Does not place or execute trades.
 */

export class DataManager {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;
    this.lastUpdate = null;
  }

  registerProvider(name, provider) {
    if (!name || !provider ||
        typeof provider.getCandles !== "function") {
      throw new Error("Invalid market data provider");
    }

    this.providers.set(name, provider);

    if (!this.activeProvider) {
      this.activeProvider = name;
    }
  }

  setActiveProvider(name) {
    if (!this.providers.has(name)) {
      throw new Error(`Provider not found: ${name}`);
    }

    this.activeProvider = name;
  }

  getProvider(name = this.activeProvider) {
    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error("No market data provider available");
    }

    return provider;
  }

  async getCandles(symbol, timeframe, limit = 100) {
    if (!symbol || !timeframe) {
      throw new Error("Symbol and timeframe are required");
    }

    const provider = this.getProvider();
    const candles = await provider.getCandles(
      symbol,
      timeframe,
      limit
    );

    if (!Array.isArray(candles)) {
      throw new Error("Provider returned invalid candle data");
    }

    const normalized = candles.map(candle => ({
      time: Number(candle.time),
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
      volume: Number(candle.volume || 0)
    }));

    for (const candle of normalized) {
      const values = [
        candle.time,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume
      ];

      if (!values.every(Number.isFinite)) {
        throw new Error("Invalid numeric candle value");
      }

      if (
        candle.high < candle.low ||
        candle.high < candle.open ||
        candle.high < candle.close ||
        candle.low > candle.open ||
        candle.low > candle.close
      ) {
        throw new Error("Invalid candle OHLC values");
      }
    }

    this.lastUpdate = new Date().toISOString();

    return normalized.sort((a, b) => a.time - b.time);
  }

  getStatus() {
    return {
      providers: [...this.providers.keys()],
      activeProvider: this.activeProvider,
      lastUpdate: this.lastUpdate
    };
  }
}
