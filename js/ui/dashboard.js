/**
 * BTC BRAIN NEXUS
 * Dashboard Manager
 *
 * Updates dashboard information.
 * Analysis only — no order execution.
 */

export class DashboardManager {
  constructor(options = {}) {
    this.elements = {
      marketStatus: options.marketStatus || "market-status",
      signal: options.signal || "market-signal",
      symbol: options.symbol || "market-symbol",
      price: options.price || "market-price",
      updated: options.updated || "last-updated"
    };
  }

  updateElement(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = String(value ?? "--");
    }
  }

  updateMarket(data = {}) {
    this.updateElement(
      this.elements.symbol,
      data.symbol || "--"
    );

    this.updateElement(
      this.elements.price,
      data.price ?? "--"
    );

    this.updateElement(
      this.elements.marketStatus,
      data.status || "DATA PENDING"
    );

    this.updateElement(
      this.elements.updated,
      new Date().toLocaleTimeString()
    );
  }

  updateSignal(signal = {}) {
    const allowed = ["LONG", "SHORT", "WAIT"];

    const value = allowed.includes(signal.signal)
      ? signal.signal
      : "WAIT";

    this.updateElement(this.elements.signal, value);
  }

  clear() {
    Object.values(this.elements).forEach(id => {
      this.updateElement(id, "--");
    });
  }
}
