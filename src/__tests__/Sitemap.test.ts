import sitemap from "../app/sitemap";

describe("Sitemap Generator", () => {
  test("should return a list of sitemap objects", () => {
    const result = sitemap();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("should include core pages", () => {
    const result = sitemap();
    const urls = result.map(item => item.url);
    expect(urls.some(url => url.includes("/guide"))).toBe(true);
    expect(urls.some(url => url.includes("/quiz"))).toBe(true);
    expect(urls.some(url => url.includes("/timeline"))).toBe(true);
  });
});
