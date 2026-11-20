/**
 * BTC BRAIN NEXUS
 * Risk Management Calculator
 *
 * Analysis and planning only.
 * Never places or executes orders.
 */

export class RiskManager {
  constructor(options = {}) {
    this.maxRiskPercent = options.maxRiskPercent ?? 1;
    this.maxDailyLossPercent = options.maxDailyLossPercent ?? 3;
  }

  calculate(positionValue, riskPercent = this.maxRiskPercent) {
    const capital = Number(positionValue);
    const risk = Number(riskPercent);

    if (
      !Number.isFinite(capital) ||
      !Number.isFinite(risk) ||
      capital <= 0 ||
      risk <= 0 ||
      risk > this.maxRiskPercent
    ) {
      throw new Error("Invalid capital or risk percentage");
    }

    return {
      capital,
      riskPercent: risk,
      maximumLoss: capital * risk / 100
    };
  }

  calculatePositionSize(entry, stopLoss, capital) {
    if (
      ![entry, stopLoss, capital].every(Number.isFinite) ||
      entry <= 0 ||
      capital <= 0
    ) {
      throw new Error("Invalid position calculation inputs");
    }

    const distance = Math.abs(entry - stopLoss);

    if (distance <= 0) {
      throw new Error("Entry and stop loss cannot be equal");
    }

    const riskAmount =
      capital * this.maxRiskPercent / 100;

    return {
      riskAmount,
      stopDistance: distance,
      estimatedQuantity: riskAmount / distance,
      maximumRiskPercent: this.maxRiskPercent
    };
  }

  checkDailyLoss(capital, currentLoss) {
    if (
      !Number.isFinite(capital) ||
      !Number.isFinite(currentLoss) ||
      capital <= 0 ||
      currentLoss < 0
    ) {
      throw new Error("Invalid daily loss values");
    }

    const lossPercent = currentLoss / capital * 100;

    return {
      lossPercent,
      limitPercent: this.maxDailyLossPercent,
      allowed: lossPercent < this.maxDailyLossPercent,
      warning: lossPercent >= this.maxDailyLossPercent
        ? "Daily loss limit reached"
        : "Within daily loss limit"
    };
  }
}
