/**
 * BTC BRAIN NEXUS
 * Alert Manager
 *
 * Browser notifications only.
 * No trading or order execution.
 */

export class AlertManager {
  constructor(options = {}) {
    this.cooldownMs = options.cooldownMs ?? 60000;
    this.lastAlerts = new Map();
    this.enabled = options.enabled ?? true;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      return {
        granted: false,
        reason: "Browser notifications are not supported"
      };
    }

    const permission = await Notification.requestPermission();

    return {
      granted: permission === "granted",
      permission
    };
  }

  canSend(alertKey) {
    const lastTime = this.lastAlerts.get(alertKey) || 0;

    return Date.now() - lastTime >= this.cooldownMs;
  }

  async send(title, message, options = {}) {
    if (!this.enabled) {
      return { sent: false, reason: "Alerts are disabled" };
    }

    if (!("Notification" in window)) {
      return {
        sent: false,
        reason: "Notifications are not supported"
      };
    }

    if (Notification.permission !== "granted") {
      return {
        sent: false,
        reason: "Notification permission not granted"
      };
    }

    const key = options.key || `${title}:${message}`;

    if (!this.canSend(key)) {
      return {
        sent: false,
        reason: "Duplicate alert cooldown"
      };
    }

    this.lastAlerts.set(key, Date.now());

    const notification = new Notification(title, {
      body: message,
      tag: key
    });

    return {
      sent: true,
      notification
    };
  }

  async sendSignal(symbol, signal) {
    if (!signal || !["LONG", "SHORT", "WAIT"].includes(signal.signal)) {
      throw new Error("Invalid strategy signal");
    }

    if (signal.signal === "WAIT") {
      return {
        sent: false,
        reason: "WAIT signals are not notified"
      };
    }

    return this.send(
      `${symbol} ${signal.signal} Signal`,
      `Entry: ${signal.entry} | SL: ${signal.stopLoss} | Target: ${signal.target}`,
      {
        key: `${symbol}:${signal.signal}:${signal.entry}`
      }
    );
  }

  clearHistory() {
    this.lastAlerts.clear();
  }
}
