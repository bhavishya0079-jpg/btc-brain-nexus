/**
 * BTC BRAIN NEXUS
 * Options Market Data Adapter
 *
 * Option-chain data only.
 * No broker connection or order execution.
 */

export class OptionsAdapter {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "";
    this.name = "Options Market Data";
  }

  async getOptionChain(symbol, expiry) {
    if (!this.baseUrl) {
      throw new Error(
        "Options data provider is not configured."
      );
    }

    const safeSymbol = String(symbol)
      .trim()
      .toUpperCase();

    if (!/^[A-Z0-9_-]{1,30}$/.test(safeSymbol)) {
      throw new Error("Invalid options symbol");
    }

    if (
      typeof expiry !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(expiry)
    ) {
      throw new Error("Expiry must use YYYY-MM-DD format");
    }

    const url = new URL(
      `${this.baseUrl.replace(/\/$/, "")}/options/chain`
    );

    url.searchParams.set("symbol", safeSymbol);
    url.searchParams.set("expiry", expiry);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Options data error: HTTP ${response.status}`
      );
    }

    const result = await response.json();

    if (!result || !Array.isArray(result.contracts)) {
      throw new Error("Invalid option-chain response");
    }

    return result.contracts.map(item => {
      const type = String(item.type || "").toUpperCase();

      if (!["CE", "PE"].includes(type)) {
        throw new Error("Invalid option contract type");
      }

      return {
        symbol: safeSymbol,
        expiry,
        strike: Number(item.strike),
        type,
        ltp: Number(item.ltp),
        volume: Number(item.volume || 0),
        openInterest: Number(item.openInterest || 0),
        impliedVolatility:
          item.impliedVolatility == null
            ? null
            : Number(item.impliedVolatility),
        delta:
          item.delta == null ? null : Number(item.delta),
        gamma:
          item.gamma == null ? null : Number(item.gamma),
        theta:
          item.theta == null ? null : Number(item.theta),
        vega:
          item.vega == null ? null : Number(item.vega)
      };
    });
  }
}
