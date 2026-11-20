/**
 * BTC BRAIN NEXUS
 * Strategy File Validator
 *
 * Checks uploaded strategy file type and size.
 * Does not execute uploaded code.
 */

export class StrategyFileValidator {
  constructor(options = {}) {
    this.maxSize = options.maxSize ?? 5 * 1024 * 1024;

    this.allowedExtensions = [
      "json",
      "txt",
      "js"
    ];
  }

  validate(file) {
    if (!file) {
      return {
        valid: false,
        reason: "No file selected"
      };
    }

    if (typeof file.name !== "string") {
      return {
        valid: false,
        reason: "Invalid file name"
      };
    }

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        reason: "File type not supported"
      };
    }

    if (!Number.isFinite(file.size) || file.size <= 0) {
      return {
        valid: false,
        reason: "File is empty or invalid"
      };
    }

    if (file.size > this.maxSize) {
      return {
        valid: false,
        reason: "File exceeds 5 MB limit"
      };
    }

    return {
      valid: true,
      fileName: file.name,
      extension,
      size: file.size,
      reason: "File passed basic checks"
    };
  }
}
