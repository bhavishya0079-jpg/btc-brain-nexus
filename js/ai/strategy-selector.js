/**
 * BTC BRAIN NEXUS
 * AI Strategy Selector
 *
 * Selects strategies using recorded performance.
 * Paper trading and analysis only.
 * No real order execution.
 */

export class StrategySelector {
  constructor(options = {}) {
    this.minimumTrades = options.minimumTrades ?? 10;
    this.minimumWinRate = options.minimumWinRate ?? 50;
  }

  select(strategies = []) {
    if (!Array.isArray(strategies)) {
      throw new Error("Strategies must be an array");
    }

    const eligible = strategies.filter(strategy => {
      const trades = Number(strategy.totalTrades);
      const winRate = Number(strategy.winRate);

      return (
        Number.isFinite(trades) &&
        Number.isFinite(winRate) &&
        trades >= this.minimumTrades &&
        winRate >= this.minimumWinRate
      );
    });

    if (eligible.length === 0) {
      return {
        selected: null,
        reason: "No strategy meets the minimum requirements"
      };
    }

    const ranked = [...eligible].sort((a, b) => {
      const scoreA =
        Number(a.winRate) * 0.7 +
        Number(a.totalPnL || 0) * 0.3;

      const scoreB =
        Number(b.winRate) * 0.7 +
        Number(b.totalPnL || 0) * 0.3;

      return scoreB - scoreA;
    });

    return {
      selected: ranked[0],
      candidates: ranked.length,
      reason: "Selected using recorded performance",
      mode: "PAPER_TRADING_ONLY"
    };
  }
}
