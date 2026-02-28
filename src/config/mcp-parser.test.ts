import { expect, test, describe } from "bun:test";
import { parseList } from "./mcp-parser";

describe("parseList", () => {
  const allAvailable = ["a", "b", "c"];

  test("returns empty list for empty items", () => {
    expect(parseList([], allAvailable)).toEqual([]);
  });

  test("returns specific items", () => {
    expect(parseList(["a", "b"], allAvailable)).toEqual(["a", "b"]);
  });

  test("returns all items with *", () => {
    expect(parseList(["*"], allAvailable)).toEqual(["a", "b", "c"]);
  });

  test("excludes specific items", () => {
    expect(parseList(["*", "!b"], allAvailable)).toEqual(["a", "c"]);
  });

  test("excludes all with !*", () => {
    expect(parseList(["a", "!*"], allAvailable)).toEqual([]);
  });

  test("handles only exclusions", () => {
    expect(parseList(["!b"], allAvailable)).toEqual([]);
  });
});
