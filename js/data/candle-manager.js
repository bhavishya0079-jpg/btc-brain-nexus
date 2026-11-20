/**
 * BTC BRAIN NEXUS
 * Candle Manager
 *
 * Stores, validates and merges candle data.
 */

export class CandleManager {
  constructor(maxCandles = 2000) {
    this.maxCandles = maxCandles;
    this.store = new Map();
  }

  getKey(symbol, timeframe) {
    return `${symbol.toUpperCase()}_${timeframe}`;
  }

  validate(candle) {
    const values = [
      candle.time,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      candle.volume
    ];

    if (!values.every(Number.isFinite)) {
      throw new Error("Invalid candle values");
    }

    if (
      candle.high < candle.low ||
      candle.high < candle.open ||
      candle.high < candle.close ||
      candle.low > candle.open ||
      candle.low > candle.close ||
      candle.volume < 0
    ) {
      throw new Error("Invalid OHLCV candle");
    }

    return true;
  }

  update(symbol, timeframe, candles) {
    if (!Array.isArray(candles)) {
      throw new Error("Candles must be an array");
    }

    const key = this.getKey(symbol, timeframe);
    const existing = this.store.get(key) || [];
    const merged = new Map();

    for (const candle of existing) {
      merged.set(candle.time, candle);
    }

    for (const candle of candles) {
      this.validate(candle);
      merged.set(candle.time, { ...candle });
    }

    const result = [...merged.values()]
      .sort((a, b) => a.time - b.time)
      .slice(-this.maxCandles);

    this.store.set(key, result);

    return [...result];
  }

  get(symbol, timeframe, limit = this.maxCandles) {
    const key = this.getKey(symbol, timeframe);
    const candles = this.store.get(key) || [];

    const safeLimit = Math.max(
      1,
      Math.min(Number(limit) || this.maxCandles, this.maxCandles)
    );

    return candles.slice(-safeLimit);
  }

  clear(symbol, timeframe) {
    if (symbol && timeframe) {
      this.store.delete(this.getKey(symbol, timeframe));
    } else {
      this.store.clear();
    }
  }
}
