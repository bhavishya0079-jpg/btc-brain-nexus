/**
 * BTC BRAIN NEXUS
 * Paper Trading Simulator
 *
 * Virtual trades only.
 * Never connects to a broker or places real orders.
 */

export class PaperTrading {
  constructor(initialBalance = 10000) {
    if (!Number.isFinite(initialBalance) || initialBalance <= 0) {
      throw new Error("Invalid virtual balance");
    }

    this.initialBalance = initialBalance;
    this.balance = initialBalance;
    this.positions = [];
    this.history = [];
    this.nextId = 1;
  }

  open(signal, symbol, quantity = 1) {
    if (!signal || !["LONG", "SHORT"].includes(signal.signal)) {
      throw new Error("Only LONG or SHORT signals are accepted");
    }

    const entry = Number(signal.entry);
    const stopLoss = Number(signal.stopLoss);
    const target = Number(signal.target);
    const size = Number(quantity);

    if (
      ![entry, stopLoss, target, size].every(Number.isFinite) ||
      entry <= 0 ||
      size <= 0
    ) {
      throw new Error("Invalid paper trade values");
    }

    if (
      (signal.signal === "LONG" &&
        (stopLoss >= entry || target <= entry)) ||
      (signal.signal === "SHORT" &&
        (stopLoss <= entry || target >= entry))
    ) {
      throw new Error("Invalid stop loss or target");
    }

    const position = {
      id: this.nextId++,
      symbol: String(symbol).toUpperCase(),
      direction: signal.signal,
      entry,
      stopLoss,
      target,
      quantity: size,
      status: "OPEN",
      openedAt: new Date().toISOString()
    };

    this.positions.push(position);

    return { ...position };
  }

  close(positionId, exitPrice) {
    const position = this.positions.find(
      item => item.id === positionId && item.status === "OPEN"
    );

    if (!position) {
      throw new Error("Open paper position not found");
    }

    const exit = Number(exitPrice);

    if (!Number.isFinite(exit) || exit <= 0) {
      throw new Error("Invalid exit price");
    }

    const profit = position.direction === "LONG"
      ? (exit - position.entry) * position.quantity
      : (position.entry - exit) * position.quantity;

    position.status = "CLOSED";
    position.exit = exit;
    position.profit = profit;
    position.closedAt = new Date().toISOString();

    this.balance += profit;

    this.history.push({ ...position });

    return {
      ...position,
      balance: this.balance
    };
  }

  getOpenPositions() {
    return this.positions
      .filter(item => item.status === "OPEN")
      .map(item => ({ ...item }));
  }

  getHistory() {
    return this.history.map(item => ({ ...item }));
  }

  getSummary() {
    const wins = this.history.filter(
      item => item.profit > 0
    ).length;

    const losses = this.history.filter(
      item => item.profit <= 0
    ).length;

    return {
      initialBalance: this.initialBalance,
      currentBalance: this.balance,
      netProfit: this.balance - this.initialBalance,
      openPositions: this.getOpenPositions().length,
      closedTrades: this.history.length,
      wins,
      losses,
      winRate: this.history.length
        ? wins / this.history.length * 100
        : 0
    };
  }
}
