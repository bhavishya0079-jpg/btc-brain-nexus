/**
 * BTC BRAIN NEXUS
 * API Configuration Manager
 *
 * Stores public provider configuration only.
 * Never stores secret API keys in browser storage.
 */

import { StorageManager } from "./storage.js";

export class APIConfig {
  constructor() {
    this.storage = new StorageManager();
    this.storageKey = "bbn_api_config";
    this.config = this.load();
  }

  load() {
    const saved = this.storage.get(this.storageKey);

    return saved && typeof saved === "object" &&
      !Array.isArray(saved)
      ? saved
      : {};
  }

  setProvider(name, settings = {}) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Provider name is required");
    }

    if (
      !settings ||
      typeof settings !== "object" ||
      Array.isArray(settings)
    ) {
      throw new Error("Invalid provider settings");
    }

    const safeSettings = { ...settings };

    for (const key of Object.keys(safeSettings)) {
      if (/secret|api.?key|password|token/i.test(key)) {
        throw new Error(
          "Secret credentials must be stored on a secure backend"
        );
      }
    }

    this.config[name.trim()] = safeSettings;
    this.storage.set(this.storageKey, this.config);

    return this.getProvider(name);
  }

  getProvider(name) {
    const settings = this.config[name];

    return settings ? { ...settings } : null;
  }

  getAll() {
    return JSON.parse(JSON.stringify(this.config));
  }

  removeProvider(name) {
    delete this.config[name];
    this.storage.set(this.storageKey, this.config);
  }

  clear() {
    this.config = {};
    this.storage.set(this.storageKey, this.config);
  }
}
