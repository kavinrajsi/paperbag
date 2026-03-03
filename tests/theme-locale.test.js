const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');

describe('Locale files', () => {
  test('en.default.json exists and is valid JSON', () => {
    const filePath = path.join(themeRoot, 'locales/en.default.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('en.default.schema.json exists and is valid JSON', () => {
    const filePath = path.join(themeRoot, 'locales/en.default.schema.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(() => JSON.parse(content)).not.toThrow();
  });
});

describe('Required translation keys', () => {
  let translations;

  beforeAll(() => {
    const content = fs.readFileSync(path.join(themeRoot, 'locales/en.default.json'), 'utf8');
    translations = JSON.parse(content);
  });

  const requiredTopLevelKeys = [
    'general',
    'products',
    'collections',
    'cart',
    'customer',
    'blog',
    'contact',
    'search',
    '404',
    'password',
    'accessibility',
    'sections'
  ];

  test.each(requiredTopLevelKeys)('has top-level key "%s"', (key) => {
    expect(translations).toHaveProperty(key);
  });

  test('general has required keys', () => {
    expect(translations.general).toHaveProperty('search');
    expect(translations.general).toHaveProperty('cart');
    expect(translations.general).toHaveProperty('menu');
    expect(translations.general).toHaveProperty('close');
    expect(translations.general).toHaveProperty('continue_shopping');
  });

  test('products.product has required keys', () => {
    expect(translations.products.product).toHaveProperty('add_to_cart');
    expect(translations.products.product).toHaveProperty('sold_out');
    expect(translations.products.product).toHaveProperty('quantity');
    expect(translations.products.product).toHaveProperty('description');
  });

  test('cart has required keys', () => {
    expect(translations.cart).toHaveProperty('title');
    expect(translations.cart).toHaveProperty('empty');
    expect(translations.cart).toHaveProperty('subtotal');
    expect(translations.cart).toHaveProperty('checkout');
  });

  test('customer has required keys', () => {
    expect(translations.customer).toHaveProperty('login');
    expect(translations.customer).toHaveProperty('register');
    expect(translations.customer).toHaveProperty('account');
    expect(translations.customer).toHaveProperty('order');
    expect(translations.customer).toHaveProperty('addresses');
  });
});

describe('Schema translation keys', () => {
  let schemaTranslations;

  beforeAll(() => {
    const content = fs.readFileSync(path.join(themeRoot, 'locales/en.default.schema.json'), 'utf8');
    schemaTranslations = JSON.parse(content);
  });

  test('has settings_schema key', () => {
    expect(schemaTranslations).toHaveProperty('settings_schema');
  });

  const requiredSchemaGroups = [
    'colors',
    'typography',
    'logo',
    'social_media',
    'cart',
    'product',
    'search'
  ];

  test.each(requiredSchemaGroups)('has schema group "%s"', (group) => {
    expect(schemaTranslations.settings_schema).toHaveProperty(group);
  });
});
