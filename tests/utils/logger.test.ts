import { expect, test, describe, spyOn, beforeEach, afterEach } from "bun:test";
import { logger } from "../../src/utils/index";

describe("Logger Utility", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("logger.info should log to console.error", () => {
    logger.info("test info");
    expect(console.error).toHaveBeenCalledWith("[opencoding-agent] test info");
  });

  test("logger.success should log with SUCCESS prefix", () => {
    logger.success("test success");
    expect(console.error).toHaveBeenCalledWith("[opencoding-agent] SUCCESS: test success");
  });

  test("logger.warn should log to console.warn", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("test warn");
    expect(console.warn).toHaveBeenCalledWith("[opencoding-agent] test warn");
    warnSpy.mockRestore();
  });

  test("logger.error should log message and error", () => {
    logger.error("test error", "err details");
    expect(console.error).toHaveBeenCalledWith("[opencoding-agent] test error", "err details");
  });
});
