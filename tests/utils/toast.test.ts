import { expect, test, describe, mock } from "bun:test";
import { showToast } from "../../src/utils/index";

describe("Toast Utility", () => {
  test("showToast should call client.tui.showToast if available", async () => {
    const showToastMock = mock(async () => {});
    const mockClient = {
      tui: {
        showToast: showToastMock
      }
    };

    await showToast(mockClient, {
      title: "Test",
      message: "Hello",
      variant: "success"
    });

    expect(showToastMock).toHaveBeenCalled();
    const callArgs = showToastMock.mock.calls[0] as any[];
    const body = callArgs[0].body;
    expect(body.title).toBe("Test");
    expect(body.message).toBe("Hello");
    expect(body.variant).toBe("success");
  });

  test("showToast should fail silently if client is not provided", async () => {
    await showToast(null, {
      message: "Hello",
      variant: "info"
    });
    // Should not throw
  });
});
