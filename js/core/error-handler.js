/**
 * BTC BRAIN NEXUS
 * Central Error Handler
 *
 * Records application errors for diagnostics.
 * No broker connection or order execution.
 */

export class ErrorHandler {
  constructor(options = {}) {
    this.maxErrors = options.maxErrors ?? 100;
    this.errors = [];
  }

  capture(error, context = "APPLICATION") {
    const record = {
      message: error instanceof Error
        ? error.message
        : String(error),
      context,
      timestamp: new Date().toISOString()
    };

    this.errors.push(record);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    return { ...record };
  }

  getAll() {
    return this.errors.map(error => ({ ...error }));
  }

  getLatest(count = 10) {
    const limit = Math.max(0, Math.floor(count));

    return this.getAll().slice(-limit);
  }

  clear() {
    this.errors = [];
  }
}
