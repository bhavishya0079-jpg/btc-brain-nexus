/**
 * BTC BRAIN NEXUS
 * Market Data Cache
 *
 * Temporarily caches market data in memory.
 * No broker connection or order execution.
 */

export class DataCache {
  constructor(options = {}) {
    this.ttl = options.ttl ?? 15000;
    this.maxEntries = options.maxEntries ?? 200;
    this.cache = new Map();
  }

  createKey(symbol, timeframe) {
    return `${symbol.toUpperCase()}:${timeframe}`;
  }

  set(symbol, timeframe, data) {
    if (!symbol || !timeframe || data == null) {
      throw new Error("Symbol, timeframe and data are required");
    }

    const key = this.createKey(symbol, timeframe);

    this.cache.delete(key);

    this.cache.set(key, {
      data,
      savedAt: Date.now()
    });

    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  get(symbol, timeframe) {
    const key = this.createKey(symbol, timeframe);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.savedAt > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(symbol, timeframe) {
    return this.get(symbol, timeframe) !== null;
  }

  remove(symbol, timeframe) {
    return this.cache.delete(
      this.createKey(symbol, timeframe)
    );
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}
