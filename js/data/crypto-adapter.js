/**
 * BTC BRAIN NEXUS
 * Crypto Public Market Data Adapter
 * Market data only - no trading or order execution.
 */

export class CryptoAdapter {
  constructor(baseUrl = "https://data-api.binance.vision") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.name = "Binance Public Market Data";
  }

  normalizeSymbol(symbol) {
    return String(symbol)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

  async getCandles(symbol, timeframe = "5m", limit = 100) {
    const allowedTimeframes = [
      "1m", "3m", "5m", "15m",
      "30m", "1h", "2h", "4h",
      "6h", "12h", "1d", "1w"
    ];

    if (!allowedTimeframes.includes(timeframe)) {
      throw new Error("Unsupported candle timeframe");
    }

    const safeLimit = Math.min(
      Math.max(Number(limit) || 100, 1),
      1000
    );

    const safeSymbol = this.normalizeSymbol(symbol);

    if (!safeSymbol) {
      throw new Error("Invalid crypto symbol");
    }

    const params = new URLSearchParams({
      symbol: safeSymbol,
      interval: timeframe,
      limit: String(safeLimit)
    });

    const url = `${this.baseUrl}/api/v3/klines?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(
        `Market data request failed: HTTP ${response.status}`
      );
    }

    const rows = await response.json();

    if (!Array.isArray(rows)) {
      throw new Error("Invalid market data response");
    }

    return rows.map(row => ({
      time: Number(row[0]),
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5])
    }));
  }
}
