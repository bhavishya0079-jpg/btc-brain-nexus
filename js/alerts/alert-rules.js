/**
 * BTC BRAIN NEXUS
 * Alert Rules Manager
 *
 * Manages price and signal alert conditions.
 * Alerts only — no order execution.
 */

export class AlertRules {
  constructor() {
    this.rules = new Map();
  }

  add(rule) {
    if (!rule || typeof rule !== "object") {
      throw new Error("Invalid alert rule");
    }

    const { id, symbol, type, price } = rule;

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof symbol !== "string" ||
      !symbol.trim()
    ) {
      throw new Error("Rule ID and symbol are required");
    }

    if (!["ABOVE", "BELOW"].includes(type)) {
      throw new Error("Invalid alert type");
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      throw new Error("Invalid alert price");
    }

    const record = {
      id,
      symbol: symbol.trim().toUpperCase(),
      type,
      price: Number(price),
      enabled: rule.enabled !== false,
      createdAt: new Date().toISOString()
    };

    this.rules.set(id, record);

    return { ...record };
  }

  checkPrice(symbol, currentPrice) {
    if (!Number.isFinite(Number(currentPrice))) {
      return [];
    }

    const normalizedSymbol = String(symbol).toUpperCase();
    const triggered = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.symbol !== normalizedSymbol) {
        continue;
      }

      const matched =
        (rule.type === "ABOVE" && currentPrice >= rule.price) ||
        (rule.type === "BELOW" && currentPrice <= rule.price);

      if (matched) {
        triggered.push({ ...rule });
        rule.enabled = false;
      }
    }

    return triggered;
  }

  getAll() {
    return Array.from(this.rules.values()).map(
      rule => ({ ...rule })
    );
  }

  remove(id) {
    return this.rules.delete(id);
  }

  clear() {
    this.rules.clear();
  }
}
