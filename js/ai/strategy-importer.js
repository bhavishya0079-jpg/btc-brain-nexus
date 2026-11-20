/**
 * BTC BRAIN NEXUS
 * Strategy Importer
 *
 * Imports JSON strategy files.
 * Imported strategies must be validated separately.
 * No real order execution.
 */

export class StrategyImporter {
  importJSON(jsonText) {
    if (typeof jsonText !== "string" || !jsonText.trim()) {
      throw new Error("Strategy file is empty");
    }

    let data;

    try {
      data = JSON.parse(jsonText);
    } catch {
      throw new Error("Invalid JSON file");
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Invalid strategy format");
    }

    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new Error("Strategy name is required");
    }

    return {
      name: data.name.trim(),
      description:
        typeof data.description === "string"
          ? data.description
          : "",
      rules:
        data.rules && typeof data.rules === "object"
          ? data.rules
          : {},
      importedAt: new Date().toISOString(),
      status: "IMPORTED_NOT_VALIDATED"
    };
  }
}
