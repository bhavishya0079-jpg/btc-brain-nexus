/**
 * BTC BRAIN NEXUS
 * Technical Indicators
 *
 * EMA, RSI, MACD, Bollinger Bands and ATR
 */

export class Indicators {
  static ema(values, period) {
    if (!Array.isArray(values) || period < 1) {
      throw new Error("Invalid EMA input");
    }

    const result = Array(values.length).fill(null);

    if (values.length < period) return result;

    const multiplier = 2 / (period + 1);

    let previous = values
      .slice(0, period)
      .reduce((sum, value) => sum + Number(value), 0) / period;

    result[period - 1] = previous;

    for (let i = period; i < values.length; i++) {
      previous =
        (Number(values[i]) - previous) * multiplier + previous;

      result[i] = previous;
    }

    return result;
  }

  static sma(values, period) {
    const result = Array(values.length).fill(null);

    for (let i = period - 1; i < values.length; i++) {
      const slice = values.slice(i - period + 1, i + 1);

      result[i] =
        slice.reduce((sum, value) => sum + Number(value), 0) /
        period;
    }

    return result;
  }

  static rsi(values, period = 14) {
    const result = Array(values.length).fill(null);

    if (values.length <= period) return result;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = values[i] - values[i - 1];

      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    const calculate = () => {
      if (avgLoss === 0) return avgGain === 0 ? 50 : 100;

      const rs = avgGain / avgLoss;
      return 100 - 100 / (1 + rs);
    };

    result[period] = calculate();

    for (let i = period + 1; i < values.length; i++) {
      const change = values[i] - values[i - 1];

      avgGain =
        (avgGain * (period - 1) + Math.max(change, 0)) / period;

      avgLoss =
        (avgLoss * (period - 1) + Math.max(-change, 0)) / period;

      result[i] = calculate();
    }

    return result;
  }

  static macd(values, fast = 12, slow = 26, signal = 9) {
    const fastEma = this.ema(values, fast);
    const slowEma = this.ema(values, slow);

    const line = values.map((_, i) => {
      if (fastEma[i] === null || slowEma[i] === null) return null;
      return fastEma[i] - slowEma[i];
    });

    const validStart = slow - 1;
    const validValues = line.slice(validStart);
    const signalValues = this.ema(
      validValues.map(value => value ?? 0),
      signal
    );

    const signalLine = Array(values.length).fill(null);
    const histogram = Array(values.length).fill(null);

    for (let i = 0; i < signalValues.length; i++) {
      const index = validStart + i;

      if (line[index] !== null && signalValues[i] !== null) {
        signalLine[index] = signalValues[i];
        histogram[index] = line[index] - signalValues[i];
      }
    }

    return { line, signal: signalLine, histogram };
  }

  static bollinger(values, period = 20, multiplier = 2) {
    const middle = this.sma(values, period);

    const upper = Array(values.length).fill(null);
    const lower = Array(values.length).fill(null);

    for (let i = period - 1; i < values.length; i++) {
      const slice = values.slice(i - period + 1, i + 1);
      const mean = middle[i];

      const variance =
        slice.reduce(
          (sum, value) => sum + Math.pow(value - mean, 2),
          0
        ) / period;

      const deviation = Math.sqrt(variance);

      upper[i] = mean + multiplier * deviation;
      lower[i] = mean - multiplier * deviation;
    }

    return { upper, middle, lower };
  }

  static atr(candles, period = 14) {
    const trueRanges = candles.map((candle, i) => {
      if (i === 0) return candle.high - candle.low;

      const previousClose = candles[i - 1].close;

      return Math.max(
        candle.high - candle.low,
        Math.abs(candle.high - previousClose),
        Math.abs(candle.low - previousClose)
      );
    });

    return this.ema(trueRanges, period);
  }
}
