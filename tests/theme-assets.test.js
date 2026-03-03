const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(themeRoot, 'assets');

describe('Required asset files', () => {
  test('assets/base.css exists and is non-empty', () => {
    const filePath = path.join(assetsDir, 'base.css');
    expect(fs.existsSync(filePath)).toBe(true);
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('assets/global.js exists and is non-empty', () => {
    const filePath = path.join(assetsDir, 'global.js');
    expect(fs.existsSync(filePath)).toBe(true);
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('assets/product-page.js exists and is non-empty', () => {
    const filePath = path.join(assetsDir, 'product-page.js');
    expect(fs.existsSync(filePath)).toBe(true);
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  });
});

describe('Required snippet files', () => {
  const requiredSnippets = [
    'icon.liquid',
    'image.liquid',
    'price.liquid',
    'product-card.liquid',
    'breadcrumb.liquid',
    'pagination.liquid',
    'social-icons.liquid'
  ];

  test.each(requiredSnippets)('snippets/%s exists', (snippet) => {
    const filePath = path.join(themeRoot, 'snippets', snippet);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
