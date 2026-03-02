import { expect, test, describe } from "bun:test";
import { mergePluginHooks } from "../../src/utils/hooks";

describe("mergePluginHooks", () => {
  test("should merge independent hooks", () => {
    const h1 = { a: 1 };
    const h2 = { b: 2 };
    const merged = mergePluginHooks([h1, h2]);
    expect(merged).toEqual({ a: 1, b: 2 });
  });

  test("should chain overlapping transform hooks", async () => {
    const output = { system: [] as string[] };
    const h1 = {
      'experimental.chat.system.transform': async (_in: any, out: any) => {
        out.system.push("h1");
      }
    };
    const h2 = {
      'experimental.chat.system.transform': async (_in: any, out: any) => {
        out.system.push("h2");
      }
    };

    const merged = mergePluginHooks([h1, h2]);
    await merged['experimental.chat.system.transform']({}, output);

    expect(output.system).toEqual(["h1", "h2"]);
  });
});
