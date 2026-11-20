/**
 * BTC BRAIN NEXUS
 * Strategy Validator
 *
 * Validates strategy structure before testing.
 * Never executes uploaded strategy code.
 */

export class StrategyValidator {
  constructor() {
    this.allowedSignals = ["LONG", "SHORT", "WAIT"];
    this.requiredFields = [
      "name",
      "version",
      "analyze"
    ];
  }

  validate(strategy) {
    const errors = [];
    const warnings = [];

    if (!strategy || typeof strategy !== "object") {
      return {
        valid: false,
        errors: ["Strategy must be an object"],
        warnings
      };
    }

    for (const field of this.requiredFields) {
      if (!(field in strategy)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (
      strategy.name &&
      typeof strategy.name !== "string"
    ) {
      errors.push("Strategy name must be text");
    }

    if (
      strategy.version &&
      typeof strategy.version !== "string"
    ) {
      errors.push("Strategy version must be text");
    }

    if (
      typeof strategy.analyze !== "function"
    ) {
      errors.push("Strategy analyze must be a function");
    }

    if (
      strategy.analyze &&
      typeof strategy.analyze === "function"
    ) {
      warnings.push(
        "Function validation does not prove strategy safety or profitability"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateSignal(result) {
    if (!result || typeof result !== "object") {
      return {
        valid: false,
        reason: "Signal result must be an object"
      };
    }

    if (!this.allowedSignals.includes(result.signal)) {
      return {
        valid: false,
        reason: "Signal must be LONG, SHORT or WAIT"
      };
    }

    if (result.signal === "WAIT") {
      return {
        valid: true,
        reason: "WAIT signal accepted"
      };
    }

    const prices = [
      result.entry,
      result.stopLoss,
      result.target
    ];

    if (!prices.every(Number.isFinite)) {
      return {
        valid: false,
        reason: "Entry, stop loss and target must be valid numbers"
      };
    }

    if (result.signal === "LONG") {
      if (
        result.stopLoss >= result.entry ||
        result.target <= result.entry
      ) {
        return {
          valid: false,
          reason: "Invalid LONG price levels"
        };
      }
    }

    if (result.signal === "SHORT") {
      if (
        result.stopLoss <= result.entry ||
        result.target >= result.entry
      ) {
        return {
          valid: false,
          reason: "Invalid SHORT price levels"
        };
      }
    }

    return {
      valid: true,
      reason: "Signal structure accepted"
    };
  }
}
