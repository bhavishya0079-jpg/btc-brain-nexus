/**
 * BTC BRAIN NEXUS
 * Strategy Library
 *
 * Stores and versions strategy configurations.
 * No broker connection or order execution.
 */

import { StorageManager } from "../core/storage.js";

export class StrategyLibrary {
  constructor() {
    this.storage = new StorageManager();
    this.storageKey = "bbn_strategy_library";
    this.strategies = this.load();
  }

  load() {
    const saved = this.storage.get(this.storageKey);

    return Array.isArray(saved) ? saved : [];
  }

  save() {
    this.storage.set(this.storageKey, this.strategies);
  }

  add(strategy) {
    if (
      !strategy ||
      typeof strategy !== "object" ||
      typeof strategy.name !== "string" ||
      !strategy.name.trim()
    ) {
      throw new Error("Valid strategy name is required");
    }

    const id = strategy.id || crypto.randomUUID();

    if (this.strategies.some(item => item.id === id)) {
      throw new Error("Strategy ID already exists");
    }

    const record = {
      ...strategy,
      id,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.strategies.push(record);
    this.save();

    return { ...record };
  }

  update(id, changes) {
    const index = this.strategies.findIndex(
      item => item.id === id
    );

    if (index === -1) {
      throw new Error("Strategy not found");
    }

    const current = this.strategies[index];

    const updated = {
      ...current,
      ...changes,
      id: current.id,
      version: current.version + 1,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.strategies[index] = updated;
    this.save();

    return { ...updated };
  }

  get(id) {
    const strategy = this.strategies.find(
      item => item.id === id
    );

    return strategy ? { ...strategy } : null;
  }

  getAll() {
    return this.strategies.map(item => ({ ...item }));
  }

  remove(id) {
    const previousLength = this.strategies.length;

    this.strategies = this.strategies.filter(
      item => item.id !== id
    );

    this.save();

    return this.strategies.length < previousLength;
  }
}
