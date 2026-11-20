/**
 * BTC BRAIN NEXUS
 * Safe Local Storage Manager
 */

export class StorageManager {
  constructor(prefix = "BBN_") {
    this.prefix = prefix;
  }

  makeKey(key) {
    return `${this.prefix}${key}`;
  }

  save(key, value) {
    try {
      localStorage.setItem(
        this.makeKey(key),
        JSON.stringify(value)
      );
      return true;
    } catch (error) {
      console.error("[BBN Storage] Save failed:", error);
      return false;
    }
  }

  load(key, fallback = null) {
    try {
      const value = localStorage.getItem(this.makeKey(key));

      if (value === null) return fallback;

      return JSON.parse(value);
    } catch (error) {
      console.error("[BBN Storage] Load failed:", error);
      return fallback;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.makeKey(key));
      return true;
    } catch (error) {
      console.error("[BBN Storage] Remove failed:", error);
      return false;
    }
  }

  clearAll() {
    try {
      const keys = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith(this.prefix)) {
          keys.push(key);
        }
      }

      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("[BBN Storage] Clear failed:", error);
      return false;
    }
  }
}
