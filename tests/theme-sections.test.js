const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const sectionsDir = path.join(themeRoot, 'sections');

describe('Required sections exist', () => {
  const requiredSections = [
    'header.liquid',
    'footer.liquid',
    'announcement-bar.liquid',
    'hero-banner.liquid',
    'featured-collection.liquid',
    'featured-product.liquid',
    'collection-list.liquid',
    'image-with-text.liquid',
    'rich-text.liquid',
    'video.liquid',
    'testimonials.liquid',
    'newsletter.liquid',
    'logo-list.liquid',
    'main-product.liquid',
    'product-recommendations.liquid',
    'main-collection.liquid',
    'main-collection-list.liquid',
    'main-cart.liquid',
    'cart-drawer.liquid',
    'main-blog.liquid',
    'main-article.liquid',
    'main-page.liquid',
    'contact-form.liquid',
    'main-search.liquid',
    'main-404.liquid',
    'main-password.liquid',
    'main-login.liquid',
    'main-register.liquid',
    'main-account.liquid',
    'main-order.liquid',
    'main-addresses.liquid',
    'main-reset-password.liquid'
  ];

  test.each(requiredSections)('sections/%s exists', (section) => {
    expect(fs.existsSync(path.join(sectionsDir, section))).toBe(true);
  });
});

describe('Section schema validation', () => {
  test('all .liquid section files contain {% schema %}', () => {
    const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
    const missing = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
      if (!content.includes('{% schema %}')) {
        missing.push(file);
      }
    }

    expect(missing).toEqual([]);
  });

  test('all section schemas contain valid JSON', () => {
    const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
    const invalid = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
      const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (schemaMatch) {
        try {
          JSON.parse(schemaMatch[1]);
        } catch (e) {
          invalid.push({ file, error: e.message });
        }
      }
    }

    expect(invalid).toEqual([]);
  });
});

describe('Template section references', () => {
  test('all sections referenced in templates exist', () => {
    const templatesDir = path.join(themeRoot, 'templates');
    const templateFiles = [];

    // Collect all JSON template files
    const topLevel = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
    topLevel.forEach(f => templateFiles.push(path.join(templatesDir, f)));

    const customersDir = path.join(templatesDir, 'customers');
    if (fs.existsSync(customersDir)) {
      const customerFiles = fs.readdirSync(customersDir).filter(f => f.endsWith('.json'));
      customerFiles.forEach(f => templateFiles.push(path.join(customersDir, f)));
    }

    const missing = [];

    for (const templatePath of templateFiles) {
      const content = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
      if (content.sections) {
        for (const [key, section] of Object.entries(content.sections)) {
          if (section.type) {
            const sectionFile = path.join(sectionsDir, section.type + '.liquid');
            if (!fs.existsSync(sectionFile)) {
              missing.push({ template: path.basename(templatePath), section: section.type });
            }
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });
});

describe('Section group files', () => {
  test('header-group.json exists and is valid', () => {
    const filePath = path.join(sectionsDir, 'header-group.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(content).toHaveProperty('type', 'header');
    expect(content).toHaveProperty('sections');
    expect(content).toHaveProperty('order');
  });

  test('footer-group.json exists and is valid', () => {
    const filePath = path.join(sectionsDir, 'footer-group.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(content).toHaveProperty('type', 'footer');
    expect(content).toHaveProperty('sections');
    expect(content).toHaveProperty('order');
  });
});
