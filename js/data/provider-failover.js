/**
 * BTC BRAIN NEXUS
 * Data Provider Failover
 *
 * Tries multiple market data providers.
 * No broker connection or order execution.
 */

export class ProviderFailover {
  constructor() {
    this.providers = [];
  }

  register(name, provider, priority = 100) {
    if (
      typeof name !== "string" ||
      !name.trim() ||
      !provider ||
      typeof provider.getCandles !== "function"
    ) {
      throw new Error("Invalid data provider");
    }

    this.providers.push({
      name,
      provider,
      priority: Number(priority)
    });

    this.providers.sort((a, b) => a.priority - b.priority);
  }

  async getCandles(symbol, timeframe, limit = 100) {
    const errors = [];

    for (const item of this.providers) {
      try {
        const candles = await item.provider.getCandles(
          symbol,
          timeframe,
          limit
        );

        if (!Array.isArray(candles) || candles.length === 0) {
          throw new Error("Provider returned empty data");
        }

        return {
          success: true,
          provider: item.name,
          candles,
          errors
        };
      } catch (error) {
        errors.push({
          provider: item.name,
          message: error.message || "Data request failed"
        });
      }
    }

    return {
      success: false,
      provider: null,
      candles: [],
      errors
    };
  }

  remove(name) {
    this.providers = this.providers.filter(
      item => item.name !== name
    );
  }

  getProviders() {
    return this.providers.map(item => ({
      name: item.name,
      priority: item.priority
    }));
  }
}
