/**
 * BTC BRAIN NEXUS
 * Market Data Validator
 *
 * Validates incoming OHLCV market data.
 * No broker connection or order execution.
 */

export class DataValidator {
  validateCandle(candle) {
    if (!candle || typeof candle !== "object") {
      return {
        valid: false,
        reason: "Invalid candle object"
      };
    }

    const fields = [
      "open",
      "high",
      "low",
      "close",
      "volume"
    ];

    for (const field of fields) {
      if (
        !Number.isFinite(Number(candle[field])) ||
        candle[field] === null ||
        candle[field] === ""
      ) {
        return {
          valid: false,
          reason: `Invalid ${field} value`
        };
      }
    }

    const open = Number(candle.open);
    const high = Number(candle.high);
    const low = Number(candle.low);
    const close = Number(candle.close);
    const volume = Number(candle.volume);

    if (
      low <= 0 ||
      open <= 0 ||
      close <= 0 ||
      high <= 0 ||
      volume < 0
    ) {
      return {
        valid: false,
        reason: "Price must be positive and volume cannot be negative"
      };
    }

    if (
      high < Math.max(open, close, low) ||
      low > Math.min(open, close, high)
    ) {
      return {
        valid: false,
        reason: "Invalid OHLC price relationship"
      };
    }

    return {
      valid: true,
      reason: "Candle data is valid"
    };
  }

  validateCandles(candles = []) {
    if (!Array.isArray(candles)) {
      return {
        valid: false,
        validCandles: [],
        invalidCount: 0,
        reason: "Candles must be an array"
      };
    }

    const validCandles = [];
    let invalidCount = 0;

    for (const candle of candles) {
      const result = this.validateCandle(candle);

      if (result.valid) {
        validCandles.push(candle);
      } else {
        invalidCount++;
      }
    }

    return {
      valid: invalidCount === 0,
      validCandles,
      invalidCount,
      reason: invalidCount === 0
        ? "All candles are valid"
        : "Some candles contain invalid data"
    };
  }
}
