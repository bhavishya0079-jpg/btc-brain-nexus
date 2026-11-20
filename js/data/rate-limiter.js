/**
 * BTC BRAIN NEXUS
 * API Rate Limiter
 *
 * Controls request frequency.
 * No broker connection or order execution.
 */

export class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests ?? 10;
    this.windowMs = options.windowMs ?? 60000;
    this.requests = [];
  }

  canRequest() {
    const now = Date.now();

    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );

    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    if (!this.canRequest()) {
      return false;
    }

    this.requests.push(Date.now());
    return true;
  }

  getRemainingRequests() {
    this.canRequest();

    return Math.max(
      0,
      this.maxRequests - this.requests.length
    );
  }

  reset() {
    this.requests = [];
  }
}
