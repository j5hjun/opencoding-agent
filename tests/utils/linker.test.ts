import { expect, test, describe, afterAll, beforeAll } from "bun:test";
import { ensureSymlink } from "../../src/utils/linker";
import fs from "fs";
import path from "path";
import os from "os";

const TEST_DIR = path.join(os.tmpdir(), "linker-test-" + Math.random().toString(36).slice(2));

describe("Linker Utility", () => {
  beforeAll(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  test("ensureSymlink should create a new symlink for a file", () => {
    const sourceFile = path.join(TEST_DIR, "source.txt");
    const targetFile = path.join(TEST_DIR, "target.txt");
    
    fs.writeFileSync(sourceFile, "Hello");
    
    ensureSymlink(sourceFile, targetFile, "file");
    
    expect(fs.existsSync(targetFile)).toBe(true);
    expect(fs.lstatSync(targetFile).isSymbolicLink()).toBe(true);
    expect(fs.readlinkSync(targetFile)).toBe(sourceFile);
  });

  test("ensureSymlink should create a new symlink for a directory", () => {
    const sourceDir = path.join(TEST_DIR, "source-dir");
    const targetDir = path.join(TEST_DIR, "target-dir");
    
    fs.mkdirSync(sourceDir, { recursive: true });
    
    ensureSymlink(sourceDir, targetDir, "dir");
    
    expect(fs.existsSync(targetDir)).toBe(true);
    expect(fs.lstatSync(targetDir).isSymbolicLink()).toBe(true);
    expect(fs.readlinkSync(targetDir)).toBe(sourceDir);
  });

  test("ensureSymlink should update an existing symlink if it points to a different source", () => {
    const source1 = path.join(TEST_DIR, "source1.txt");
    const source2 = path.join(TEST_DIR, "source2.txt");
    const target = path.join(TEST_DIR, "target-link.txt");
    
    fs.writeFileSync(source1, "Source 1");
    fs.writeFileSync(source2, "Source 2");
    
    // Initial link
    ensureSymlink(source1, target, "file");
    expect(fs.readlinkSync(target)).toBe(source1);
    
    // Update link
    ensureSymlink(source2, target, "file");
    expect(fs.readlinkSync(target)).toBe(source2);
  });

  test("ensureSymlink should not update if already pointing to the correct source", () => {
    const source = path.join(TEST_DIR, "source-fixed.txt");
    const target = path.join(TEST_DIR, "target-fixed.txt");
    
    fs.writeFileSync(source, "Source Fixed");
    ensureSymlink(source, target, "file");
    
    const initialStats = fs.lstatSync(target);
    
    // Call again
    ensureSymlink(source, target, "file");
    
    const finalStats = fs.lstatSync(target);
    expect(initialStats.ctimeMs).toBe(finalStats.ctimeMs);
  });

  test("ensureSymlink should warn if source doesn't exist", () => {
    const source = path.join(TEST_DIR, "non-existent");
    const target = path.join(TEST_DIR, "target-non-existent");
    
    ensureSymlink(source, target, "file");
    expect(fs.existsSync(target)).toBe(false);
  });
});
