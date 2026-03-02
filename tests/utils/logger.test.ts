import { expect, test, describe, spyOn, afterEach } from "bun:test";
import { logger } from "../../src/utils/logger";

describe("Logger Utility", () => {
  afterEach(() => {
    // Cleanup spies if needed, although bun handles some automatically
  });

  test("logger.info should log to console.log with prefix", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    logger.info("Test message");
    expect(logSpy).toHaveBeenCalledWith("[opencoding-agent] Test message");
    logSpy.mockRestore();
  });

  test("logger.warn should log to console.warn with prefix", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("Warning message");
    expect(warnSpy).toHaveBeenCalledWith("[opencoding-agent] Warning message");
    warnSpy.mockRestore();
  });

  test("logger.error should log to console.error with prefix and optional error", () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const errorObj = new Error("Something went wrong");
    
    logger.error("Error message", errorObj);
    expect(errorSpy).toHaveBeenCalledWith("[opencoding-agent] Error message", errorObj);
    
    logger.error("Basic error message");
    expect(errorSpy).toHaveBeenCalledWith("[opencoding-agent] Basic error message", "");
    
    errorSpy.mockRestore();
  });
});
