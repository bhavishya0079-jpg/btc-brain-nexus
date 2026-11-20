/**
 * BTC BRAIN NEXUS
 * AI Learning Engine
 *
 * Learns from recorded strategy outcomes.
 * Does not execute trades or guarantee profits.
 */

export class LearningEngine {
  constructor() {
    this.records = [];
    this.strategyStats = new Map();
  }

  recordOutcome(strategyName, trade) {
    if (!strategyName || !trade) {
      throw new Error("Strategy name and trade are required");
    }

    const profit = Number(trade.profit);

    if (!Number.isFinite(profit)) {
      throw new Error("Invalid trade profit");
    }

    const record = {
      strategyName: String(strategyName),
      symbol: String(trade.symbol || "UNKNOWN"),
      signal: trade.signal || "UNKNOWN",
      profit,
      outcome: profit > 0 ? "WIN" : profit < 0 ? "LOSS" : "BREAKEVEN",
      recordedAt: new Date().toISOString()
    };

    this.records.push(record);
    this.updateStats(record);

    return { ...record };
  }

  updateStats(record) {
    const name = record.strategyName;

    if (!this.strategyStats.has(name)) {
      this.strategyStats.set(name, {
        trades: 0,
        wins: 0,
        losses: 0,
        totalProfit: 0
      });
    }

    const stats = this.strategyStats.get(name);

    stats.trades++;
    stats.totalProfit += record.profit;

    if (record.profit > 0) stats.wins++;
    if (record.profit < 0) stats.losses++;
  }

  getStrategyStats(strategyName) {
    const stats = this.strategyStats.get(strategyName);

    if (!stats) {
      return null;
    }

    return {
      ...stats,
      winRate: stats.trades
        ? (stats.wins / stats.trades) * 100
        : 0,
      averageProfit: stats.trades
        ? stats.totalProfit / stats.trades
        : 0
    };
  }

  compareStrategies() {
    return [...this.strategyStats.entries()]
      .map(([name, stats]) => ({
        name,
        ...this.getStrategyStats(name)
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);
  }

  getImprovementSuggestions(strategyName) {
    const stats = this.getStrategyStats(strategyName);

    if (!stats || stats.trades < 10) {
      return [
        "Collect at least 10 completed paper trades before evaluating this strategy."
      ];
    }

    const suggestions = [];

    if (stats.winRate < 40) {
      suggestions.push(
        "Review entry confirmation and false signals."
      );
    }

    if (stats.averageProfit < 0) {
      suggestions.push(
        "Review stop loss, target distance and risk/reward."
      );
    }

    if (stats.losses > stats.wins) {
      suggestions.push(
        "Test stronger trend and volume filters."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Continue paper testing and verify results on unseen data."
      );
    }

    return suggestions;
  }

  getReport() {
    return {
      totalRecords: this.records.length,
      strategiesTracked: this.strategyStats.size,
      strategies: this.compareStrategies(),
      recentRecords: this.records.slice(-20).reverse()
    };
  }

  reset() {
    this.records = [];
    this.strategyStats.clear();
  }
}
