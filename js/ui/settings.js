/**
 * BTC BRAIN NEXUS
 * Settings Manager
 *
 * Saves user interface preferences.
 * No broker connection or order execution.
 */

import { StorageManager } from "../core/storage.js";

export class SettingsManager {
  constructor() {
    this.storage = new StorageManager();

    this.defaults = {
      timeframe: "5m",
      alertsEnabled: true,
      autoRefresh: true,
      refreshInterval: 60000,
      theme: "dark"
    };

    this.settings = this.load();
  }

  load() {
    const saved = this.storage.get("bbn_settings");

    return {
      ...this.defaults,
      ...(saved && typeof saved === "object" ? saved : {})
    };
  }

  getAll() {
    return { ...this.settings };
  }

  update(key, value) {
    if (!Object.prototype.hasOwnProperty.call(this.defaults, key)) {
      throw new Error("Unknown setting: " + key);
    }

    if (key === "timeframe") {
      const allowed = [
        "1m", "3m", "5m", "15m",
        "30m", "1h", "4h", "1d"
      ];

      if (!allowed.includes(value)) {
        throw new Error("Invalid timeframe");
      }
    }

    if (key === "refreshInterval") {
      if (!Number.isFinite(value) || value < 5000) {
        throw new Error("Refresh interval must be at least 5000ms");
      }
    }

    if (["alertsEnabled", "autoRefresh"].includes(key)) {
      value = Boolean(value);
    }

    if (key === "theme" && !["dark", "light"].includes(value)) {
      throw new Error("Invalid theme");
    }

    this.settings[key] = value;
    this.save();

    return this.getAll();
  }

  save() {
    this.storage.set("bbn_settings", this.settings);
  }

  reset() {
    this.settings = { ...this.defaults };
    this.save();

    return this.getAll();
  }
}
