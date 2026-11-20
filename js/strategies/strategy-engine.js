/**
 * BTC BRAIN NEXUS
 * Strategy Analysis Engine
 *
 * Analysis only. Never executes trades.
 */

import { Indicators } from "../indicators/indicators.js";

export class StrategyEngine {
  constructor(options = {}) {
    this.settings = {
      emaFast: options.emaFast || 20,
      emaSlow: options.emaSlow || 50,
      rsiPeriod: options.rsiPeriod || 14,
      atrPeriod: options.atrPeriod || 14,
      riskReward: options.riskReward || 2,
      atrMultiplier: options.atrMultiplier || 1.5
    };
  }

  analyze(candles) {
    if (!Array.isArray(candles) || candles.length < 60) {
      return {
        signal: "WAIT",
        reason: "Not enough candle data",
        entry: null,
        stopLoss: null,
        target: null
      };
    }

    const closes = candles.map(c => Number(c.close));

    if (!closes.every(Number.isFinite)) {
      throw new Error("Invalid candle prices");
    }

    const fastEMA = Indicators.ema(
      closes,
      this.settings.emaFast
    );

    const slowEMA = Indicators.ema(
      closes,
      this.settings.emaSlow
    );

    const rsi = Indicators.rsi(
      closes,
      this.settings.rsiPeriod
    );

    const macd = Indicators.macd(closes);

    const atr = Indicators.atr(
      candles,
      this.settings.atrPeriod
    );

    const last = candles.length - 1;
    const previous = last - 1;

    const values = [
      fastEMA[last],
      slowEMA[last],
      rsi[last],
      macd.line[last],
      macd.signal[last],
      atr[last]
    ];

    if (!values.every(Number.isFinite)) {
      return {
        signal: "WAIT",
        reason: "Indicators are not ready",
        entry: null,
        stopLoss: null,
        target: null
      };
    }

    const bullish =
      fastEMA[last] > slowEMA[last] &&
      closes[last] > fastEMA[last] &&
      rsi[last] >= 50 &&
      rsi[last] <= 70 &&
      macd.line[last] > macd.signal[last] &&
      macd.line[previous] <= macd.signal[previous];

    const bearish =
      fastEMA[last] < slowEMA[last] &&
      closes[last] < fastEMA[last] &&
      rsi[last] >= 30 &&
      rsi[last] <= 50 &&
      macd.line[last] < macd.signal[last] &&
      macd.line[previous] >= macd.signal[previous];

    const entry = closes[last];
    const risk = atr[last] * this.settings.atrMultiplier;

    if (!(risk > 0) || !Number.isFinite(risk)) {
      return {
        signal: "WAIT",
        reason: "Invalid risk calculation",
        entry: null,
        stopLoss: null,
        target: null
      };
    }

    if (bullish) {
      return {
        signal: "LONG",
        reason: "Bullish trend and momentum confirmation",
        entry,
        stopLoss: entry - risk,
        target: entry + risk * this.settings.riskReward,
        riskReward: this.settings.riskReward
      };
    }

    if (bearish) {
      return {
        signal: "SHORT",
        reason: "Bearish trend and momentum confirmation",
        entry,
        stopLoss: entry + risk,
        target: entry - risk * this.settings.riskReward,
        riskReward: this.settings.riskReward
      };
    }

    return {
      signal: "WAIT",
      reason: "No confirmed setup",
      entry: null,
      stopLoss: null,
      target: null
    };
  }
}
