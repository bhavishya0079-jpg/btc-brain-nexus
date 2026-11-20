/**
 * BTC BRAIN NEXUS
 * Central Event Manager
 */

export class EventManager {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    this.events.get(eventName).add(callback);

    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    const listeners = this.events.get(eventName);

    if (!listeners) return;

    listeners.delete(callback);

    if (listeners.size === 0) {
      this.events.delete(eventName);
    }
  }

  emit(eventName, data = null) {
    const listeners = this.events.get(eventName);

    if (!listeners) return;

    for (const callback of listeners) {
      try {
        callback(data);
      } catch (error) {
        console.error(
          `[BBN Event Error] ${eventName}:`,
          error
        );
      }
    }
  }

  clear(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}
