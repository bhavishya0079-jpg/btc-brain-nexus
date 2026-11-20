/**
 * BTC BRAIN NEXUS
 * Historical Strategy Backtester
 *
 * Simulation only. No real orders.
 */

export class Backtester {
  constructor(options = {}) {
    this.initialCapital = options.initialCapital ?? 10000;
    this.riskPercent = options.riskPercent ?? 1;
  }

  run(candles, strategy) {
    if (!Array.isArray(candles) || candles.length < 60) {
      throw new Error("At least 60 candles are required");
    }

    if (!strategy || typeof strategy.analyze !== "function") {
      throw new Error("Valid strategy is required");
    }

    let capital = this.initialCapital;
    let wins = 0;
    let losses = 0;
    let trades = 0;

    const history = [];

    for (let i = 60; i < candles.length - 1; i++) {
      const availableCandles = candles.slice(0, i + 1);
      const signal = strategy.analyze(availableCandles);

      if (!signal || !["LONG", "SHORT"].includes(signal.signal)) {
        continue;
      }

      const entry = Number(signal.entry);
      const stop = Number(signal.stopLoss);
      const target = Number(signal.target);

      if (![entry, stop, target].every(Number.isFinite)) {
        continue;
      }

      const riskDistance = Math.abs(entry - stop);

      if (riskDistance <= 0) continue;

      const riskAmount = capital * this.riskPercent / 100;
      const quantity = riskAmount / riskDistance;

      let outcome = "OPEN";
      let exitPrice = null;

      for (let j = i + 1; j < candles.length; j++) {
        const candle = candles[j];

        if (signal.signal === "LONG") {
          const hitStop = candle.low <= stop;
          const hitTarget = candle.high >= target;

          if (hitStop) {
            outcome = "LOSS";
            exitPrice = stop;
            break;
          }

          if (hitTarget) {
            outcome = "WIN";
            exitPrice = target;
            break;
          }
        } else {
          const hitStop = candle.high >= stop;
          const hitTarget = candle.low <= target;

          if (hitStop) {
            outcome = "LOSS";
            exitPrice = stop;
            break;
          }

          if (hitTarget) {
            outcome = "WIN";
            exitPrice = target;
            break;
          }
        }
      }

      if (outcome === "OPEN") continue;

      const profit = signal.signal === "LONG"
        ? (exitPrice - entry) * quantity
        : (entry - exitPrice) * quantity;

      capital += profit;
      trades++;

      if (profit > 0) wins++;
      else losses++;

      history.push({
        signal: signal.signal,
        entry,
        exit: exitPrice,
        outcome,
        profit,
        capital
      });
    }

    return {
      initialCapital: this.initialCapital,
      finalCapital: capital,
      netProfit: capital - this.initialCapital,
      totalTrades: trades,
      wins,
      losses,
      winRate: trades ? (wins / trades) * 100 : 0,
      history
    };
  }
}
