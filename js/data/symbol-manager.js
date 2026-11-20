/**
 * BTC BRAIN NEXUS
 * Market Symbol Manager
 *
 * Manages symbols across different markets.
 * No broker connection or order execution.
 */

export class SymbolManager {
  constructor() {
    this.symbols = new Map();
  }

  add(symbol, market) {
    if (
      typeof symbol !== "string" ||
      !symbol.trim() ||
      typeof market !== "string" ||
      !market.trim()
    ) {
      throw new Error("Symbol and market are required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();
    const normalizedMarket = market.trim().toUpperCase();

    const key = `${normalizedMarket}:${normalizedSymbol}`;

    const record = {
      symbol: normalizedSymbol,
      market: normalizedMarket,
      addedAt: new Date().toISOString()
    };

    this.symbols.set(key, record);

    return { ...record };
  }

  get(symbol, market) {
    const key = `${market.toUpperCase()}:${symbol.toUpperCase()}`;
    const item = this.symbols.get(key);

    return item ? { ...item } : null;
  }

  getByMarket(market) {
    const value = market.toUpperCase();

    return Array.from(this.symbols.values())
      .filter(item => item.market === value)
      .map(item => ({ ...item }));
  }

  getAll() {
    return Array.from(this.symbols.values())
      .map(item => ({ ...item }));
  }

  remove(symbol, market) {
    const key = `${market.toUpperCase()}:${symbol.toUpperCase()}`;
    return this.symbols.delete(key);
  }

  clear() {
    this.symbols.clear();
  }
         }
