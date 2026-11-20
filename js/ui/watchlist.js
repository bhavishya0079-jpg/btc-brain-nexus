/**
 * BTC BRAIN NEXUS
 * Watchlist Manager
 *
 * Manages user-selected market symbols.
 * No broker connection or order execution.
 */

import { StorageManager } from "../core/storage.js";

export class WatchlistManager {
  constructor() {
    this.storage = new StorageManager();
    this.storageKey = "bbn_watchlist";
    this.symbols = this.load();
  }

  load() {
    const saved = this.storage.get(this.storageKey);

    if (!Array.isArray(saved)) {
      return ["BTCUSDT", "ETHUSDT"];
    }

    return [...new Set(
      saved.filter(
        item => typeof item === "string" && item.trim().length > 0
      ).map(item => item.trim().toUpperCase())
    )];
  }

  save() {
    this.storage.set(this.storageKey, this.symbols);
  }

  add(symbol) {
    if (typeof symbol !== "string" || !symbol.trim()) {
      throw new Error("Valid symbol is required");
    }

    const value = symbol.trim().toUpperCase();

    if (!this.symbols.includes(value)) {
      this.symbols.push(value);
      this.save();
    }

    return this.getAll();
  }

  remove(symbol) {
    const value = String(symbol).trim().toUpperCase();

    this.symbols = this.symbols.filter(
      item => item !== value
    );

    this.save();
    return this.getAll();
  }

  getAll() {
    return [...this.symbols];
  }

  clear() {
    this.symbols = [];
    this.save();
    return this.getAll();
  }
}
