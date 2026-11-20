/**
 * BTC BRAIN NEXUS
 * System Diagnostics
 */

export class Diagnostics {
  constructor() {
    this.results = [];
  }

  check(name, test) {
    const result = {
      name,
      status: "PASS",
      message: "OK",
      time: new Date().toISOString()
    };

    try {
      const output = test();

      if (output === false) {
        result.status = "FAIL";
        result.message = "Check failed";
      }
    } catch (error) {
      result.status = "FAIL";
      result.message = error.message || "Unknown error";
    }

    this.results.push(result);
    console.log(`[BBN] ${result.status}: ${name}`);

    return result;
  }

  runBasicChecks() {
    this.results = [];

    this.check("JavaScript", () => {
      return typeof window !== "undefined";
    });

    this.check("Local Storage", () => {
      return typeof localStorage !== "undefined";
    });

    this.check("Network", () => {
      return typeof navigator !== "undefined" &&
        navigator.onLine;
    });

    this.check("Application Config", () => {
      return Boolean(window.BBN_CONFIG);
    });

    return this.getReport();
  }

  getReport() {
    const passed = this.results.filter(
      item => item.status === "PASS"
    ).length;

    const failed = this.results.filter(
      item => item.status === "FAIL"
    ).length;

    return {
      total: this.results.length,
      passed,
      failed,
      status: failed === 0 ? "HEALTHY" : "CHECK REQUIRED",
      results: [...this.results]
    };
  }
}
