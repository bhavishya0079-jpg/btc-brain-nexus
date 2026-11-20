/**
 * BTC BRAIN NEXUS
 * Market Scanner
 *
 * Scans supplied market data and generates signal summaries.
 * Analysis only — no order execution.
 */

export class MarketScanner {
  constructor(strategyEngine) {
    this.strategyEngine = strategyEngine;
  }

  scan(markets = []) {
    if (!Array.isArray(markets)) {
      throw new Error("Markets must be an array");
    }

    return markets.map(market => {
      const symbol = market.symbol || "UNKNOWN";

      try {
        if (!Array.isArray(market.candles) || market.candles.length < 50) {
          return {
            symbol,
            signal: "WAIT",
            reason: "Not enough candle data"
          };
        }

        const result = this.strategyEngine.analyze(market.candles);

        return {
          symbol,
          signal: result.signal || "WAIT",
          entry: result.entry ?? null,
          stopLoss: result.stopLoss ?? null,
          target: result.target ?? null,
          reason: result.reason || "Analysis completed"
        };
      } catch (error) {
        return {
          symbol,
          signal: "WAIT",
          reason: error.message || "Analysis failed"
        };
      }
    });
  }

  filterBySignal(results = [], signal = "LONG") {
    return results.filter(item => item.signal === signal);
  }
}
