import { expect, test, describe, spyOn } from "bun:test";
import { getPluginRoot, getHomeDir, getConfigDir } from "../../src/utils/paths";
import path from "path";
import os from "os";

describe("Paths Utility", () => {
  test("getPluginRoot should return the absolute path to the project root", () => {
    const root = getPluginRoot();
    expect(path.isAbsolute(root)).toBe(true);
    // When running tests, it should point to the repo root
    expect(root).toContain("opencoding-agent");
    expect(fs.existsSync(path.join(root, "package.json"))).toBe(true);
  });

  test("getHomeDir should return os.homedir()", () => {
    expect(getHomeDir()).toBe(os.homedir());
  });

  test("getConfigDir should prioritize OPENCODE_CONFIG_DIR environment variable", () => {
    const originalEnv = process.env.OPENCODE_CONFIG_DIR;
    process.env.OPENCODE_CONFIG_DIR = "/custom/config";
    
    expect(getConfigDir()).toBe("/custom/config");
    
    process.env.OPENCODE_CONFIG_DIR = "~/custom/config";
    expect(getConfigDir()).toBe(path.join(os.homedir(), "custom/config"));
    
    process.env.OPENCODE_CONFIG_DIR = originalEnv;
  });

  test("getConfigDir should return default ~/.config/opencode if env is not set", () => {
    const originalEnv = process.env.OPENCODE_CONFIG_DIR;
    delete process.env.OPENCODE_CONFIG_DIR;
    
    expect(getConfigDir()).toBe(path.join(os.homedir(), ".config/opencode"));
    
    process.env.OPENCODE_CONFIG_DIR = originalEnv;
  });
});

import fs from "fs";
