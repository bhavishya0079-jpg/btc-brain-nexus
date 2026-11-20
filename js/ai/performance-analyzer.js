/**
 * BTC BRAIN NEXUS
 * Performance Analyzer
 *
 * Analyzes completed strategy results.
 * No real trading or order execution.
 */

export class PerformanceAnalyzer {
  analyze(trades = []) {
    if (!Array.isArray(trades)) {
      throw new Error("Trades must be an array");
    }

    const completed = trades.filter(trade =>
      trade &&
      Number.isFinite(Number(trade.pnl))
    );

    if (completed.length === 0) {
      return {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        lossRate: 0,
        totalPnL: 0,
        averagePnL: 0
      };
    }

    const wins = completed.filter(
      trade => Number(trade.pnl) > 0
    ).length;

    const losses = completed.filter(
      trade => Number(trade.pnl) < 0
    ).length;

    const totalPnL = completed.reduce(
      (sum, trade) => sum + Number(trade.pnl),
      0
    );

    const totalTrades = completed.length;

    return {
      totalTrades,
      wins,
      losses,
      breakeven: totalTrades - wins - losses,
      winRate: Number((wins / totalTrades * 100).toFixed(2)),
      lossRate: Number((losses / totalTrades * 100).toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      averagePnL: Number((totalPnL / totalTrades).toFixed(2))
    };
  }
}
