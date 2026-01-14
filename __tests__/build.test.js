const { computeHash, formatDate, renderKaTeX } = require("../build");

describe("computeHash", () => {
  test("returns consistent hash for same content", () => {
    const content = "Hello, World!";
    const hash1 = computeHash(content);
    const hash2 = computeHash(content);
    expect(hash1).toBe(hash2);
  });

  test("returns different hash for different content", () => {
    const hash1 = computeHash("Hello");
    const hash2 = computeHash("World");
    expect(hash1).not.toBe(hash2);
  });

  test("returns 32-character MD5 hash", () => {
    const hash = computeHash("test");
    expect(hash).toHaveLength(32);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });
});

describe("formatDate", () => {
  test("formats Date object to YYYY-MM-DD", () => {
    const date = new Date("2026-01-14T12:00:00Z");
    expect(formatDate(date)).toBe("2026-01-14");
  });

  test("returns string dates as-is", () => {
    expect(formatDate("2026-01-14")).toBe("2026-01-14");
    expect(formatDate("custom-date")).toBe("custom-date");
  });

  test("returns today's date for invalid input", () => {
    const result = formatDate(null);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("renderKaTeX", () => {
  test("renders inline math $...$", () => {
    const result = renderKaTeX("The formula is $x^2$.");
    expect(result).toContain("katex");
    expect(result).not.toContain("$x^2$");
  });

  test("renders display math $$...$$", () => {
    const result = renderKaTeX("$$\\sum_{i=1}^n i$$");
    expect(result).toContain("katex");
    expect(result).toContain("katex-display");
  });

  test("leaves plain text unchanged", () => {
    const text = "No math here, just text.";
    expect(renderKaTeX(text)).toBe(text);
  });

  test("handles multiple formulas", () => {
    const result = renderKaTeX("$a$ and $b$ are variables");
    const matches = result.match(/katex/g);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test("requires matched dollar pairs for inline math", () => {
    // Single $ without pair should not trigger rendering
    const text = "Price is $50";
    const result = renderKaTeX(text);
    expect(result).toBe(text);
  });
});
