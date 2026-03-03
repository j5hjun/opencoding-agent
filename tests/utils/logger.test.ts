import { expect, test, describe, spyOn, afterEach } from "bun:test";
import { logger } from "../../src/utils/logger";

describe("Logger Utility", () => {
  afterEach(() => {
    logger.setClient(null);
  });

  test("logger.info should log to console.error with prefix", () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    logger.info("Test message");
    expect(errorSpy).toHaveBeenCalledWith("[opencoding-agent] Test message");
    errorSpy.mockRestore();
  });

  test("logger.success should log to console and show toast if client exists", async () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const mockTui = { showToast: async () => {} };
    const mockShowToast = spyOn(mockTui, "showToast").mockImplementation(async () => {});
    const mockClient = { tui: mockTui };
    
    logger.setClient(mockClient);
    logger.success("Success message", "Success Title");

    expect(errorSpy).toHaveBeenCalledWith("[opencoding-agent] SUCCESS: Success message");
    expect(mockShowToast).toHaveBeenCalled();
    
    errorSpy.mockRestore();
  });

  test("logger.warn should log to console.warn and show toast", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    const mockTui = { showToast: async () => {} };
    const mockShowToast = spyOn(mockTui, "showToast").mockImplementation(async () => {});
    const mockClient = { tui: mockTui };

    logger.setClient(mockClient);
    logger.warn("Warning message");

    expect(warnSpy).toHaveBeenCalledWith("[opencoding-agent] Warning message");
    expect(mockShowToast).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  test("logger.error should log to console.error and show toast", () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const mockTui = { showToast: async () => {} };
    const mockShowToast = spyOn(mockTui, "showToast").mockImplementation(async () => {});
    const mockClient = { tui: mockTui };
    const errorObj = new Error("Something went wrong");

    logger.setClient(mockClient);
    logger.error("Error message", errorObj);

    expect(errorSpy).toHaveBeenCalledWith("[opencoding-agent] Error message", errorObj);
    expect(mockShowToast).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
