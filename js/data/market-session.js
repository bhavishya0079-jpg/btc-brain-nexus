/**
 * BTC BRAIN NEXUS
 * Market Session Manager
 *
 * Checks market trading sessions.
 * No broker connection or order execution.
 */

export class MarketSession {
  getStatus(market, date = new Date()) {
    const name = String(market).toUpperCase();

    if (name === "CRYPTO") {
      return {
        market: name,
        open: true,
        status: "OPEN_24_7",
        reason: "Crypto markets operate continuously"
      };
    }

    if (!["NSE", "BSE"].includes(name)) {
      return {
        market: name,
        open: false,
        status: "UNKNOWN",
        reason: "Market session not configured"
      };
    }

    const day = date.getDay();

    if (day === 0 || day === 6) {
      return {
        market: name,
        open: false,
        status: "CLOSED",
        reason: "Weekend"
      };
    }

    const minutes = date.getHours() * 60 + date.getMinutes();

    const openTime = 9 * 60 + 15;
    const closeTime = 15 * 60 + 30;

    const open = minutes >= openTime && minutes < closeTime;

    return {
      market: name,
      open,
      status: open ? "OPEN" : "CLOSED",
      timezone: "Asia/Kolkata",
      reason: open
        ? "Within regular market hours"
        : "Outside regular market hours"
    };
  }
}
