/**
 * BTC BRAIN NEXUS
 * Backup Manager
 *
 * Exports and restores local application data.
 * No trading or order execution.
 */

export class BackupManager {
  constructor() {
    this.storagePrefix = "bbn_";
  }

  createBackup() {
    const data = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(this.storagePrefix)) {
        data[key] = localStorage.getItem(key);
      }
    }

    return {
      app: "BTC BRAIN NEXUS",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      data
    };
  }

  downloadBackup() {
    const backup = this.createBackup();

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "btc-brain-nexus-backup.json";
    link.click();

    URL.revokeObjectURL(url);

    return true;
  }

  restoreBackup(backup) {
    if (
      !backup ||
      backup.app !== "BTC BRAIN NEXUS" ||
      !backup.data ||
      typeof backup.data !== "object" ||
      Array.isArray(backup.data)
    ) {
      throw new Error("Invalid backup file");
    }

    for (const [key, value] of Object.entries(backup.data)) {
      if (
        key.startsWith(this.storagePrefix) &&
        typeof value === "string"
      ) {
        localStorage.setItem(key, value);
      }
    }

    return true;
  }
}
