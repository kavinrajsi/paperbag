const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');

describe('Theme directory structure', () => {
  const requiredDirs = [
    'layout',
    'templates',
    'templates/customers',
    'sections',
    'snippets',
    'config',
    'locales',
    'assets'
  ];

  test.each(requiredDirs)('directory %s exists', (dir) => {
    const dirPath = path.join(themeRoot, dir);
    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.statSync(dirPath).isDirectory()).toBe(true);
  });
});

describe('Required layout files', () => {
  test('layout/theme.liquid exists', () => {
    expect(fs.existsSync(path.join(themeRoot, 'layout/theme.liquid'))).toBe(true);
  });

  test('layout/password.liquid exists', () => {
    expect(fs.existsSync(path.join(themeRoot, 'layout/password.liquid'))).toBe(true);
  });
});

describe('Required template files', () => {
  const requiredTemplates = [
    'index.json',
    'product.json',
    'collection.json',
    'collection.list.json',
    'cart.json',
    'blog.json',
    'article.json',
    'page.json',
    'page.contact.json',
    'search.json',
    '404.json',
    'password.json'
  ];

  test.each(requiredTemplates)('templates/%s exists and is valid JSON', (template) => {
    const filePath = path.join(themeRoot, 'templates', template);
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  const requiredCustomerTemplates = [
    'login.json',
    'register.json',
    'account.json',
    'order.json',
    'addresses.json',
    'reset_password.json'
  ];

  test.each(requiredCustomerTemplates)('templates/customers/%s exists and is valid JSON', (template) => {
    const filePath = path.join(themeRoot, 'templates/customers', template);
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(() => JSON.parse(content)).not.toThrow();
  });
});

describe('Config files', () => {
  test('config/settings_schema.json exists and is valid JSON', () => {
    const filePath = path.join(themeRoot, 'config/settings_schema.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  });

  test('config/settings_data.json exists and is valid JSON', () => {
    const filePath = path.join(themeRoot, 'config/settings_data.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty('current');
  });
});
