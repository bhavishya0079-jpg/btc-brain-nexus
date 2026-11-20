/**
 * BTC BRAIN NEXUS
 * Data Connection Monitor
 *
 * Monitors market data provider status.
 * Does not connect to brokers or execute orders.
 */

export class ConnectionMonitor {
  constructor() {
    this.providers = new Map();
  }

  update(providerName, status, details = {}) {
    if (!providerName) {
      throw new Error("Provider name is required");
    }

    const allowedStatuses = [
      "CONNECTED",
      "DISCONNECTED",
      "ERROR"
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid connection status");
    }

    this.providers.set(providerName, {
      name: providerName,
      status,
      lastUpdated: new Date().toISOString(),
      lastDataAt: details.lastDataAt || null,
      message: details.message || ""
    });

    return this.get(providerName);
  }

  get(providerName) {
    const provider = this.providers.get(providerName);
    return provider ? { ...provider } : null;
  }

  getAll() {
    return Array.from(this.providers.values()).map(
      provider => ({ ...provider })
    );
  }

  isConnected(providerName) {
    return this.providers.get(providerName)?.status === "CONNECTED";
  }

  remove(providerName) {
    return this.providers.delete(providerName);
  }

  clear() {
    this.providers.clear();
  }
}
