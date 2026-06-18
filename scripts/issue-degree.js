// Issue a new degree.
// Usage: node scripts/issue-degree.js "Recipient Name" ["PhD"] ["Hegemony"]

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'pages', 'degrees-data.json');

const name = process.argv[2];
const degreeType = process.argv[3] || 'PhD';
const field = process.argv[4] || 'Hegemony';

if (!name) {
  console.error('Usage: node scripts/issue-degree.js "Recipient Name" ["PhD"] ["Hegemony"]');
  process.exit(1);
}

// Generate slug
const slug = name.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'degree-' + Date.now();

// Load existing degrees
let degrees = [];
if (fs.existsSync(dataPath)) {
  degrees = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

// Check for duplicate slug
if (degrees.some(d => d.slug === slug)) {
  console.error(`Slug "${slug}" already exists. Try a different name.`);
  process.exit(1);
}

const issuedDate = new Date().toISOString().split('T')[0];

const degree = { slug, name, degree_type: degreeType, field, issued_date: issuedDate };
degrees.push(degree);

// Sort by date descending
degrees.sort((a, b) => b.issued_date.localeCompare(a.issued_date));

// Write the data file
fs.writeFileSync(dataPath, JSON.stringify(degrees, null, 2));

console.log(`\n✓ Degree issued:`);
console.log(`  Name:        ${name}`);
console.log(`  Degree:      ${degreeType} in ${field}`);
console.log(`  Slug:        ${slug}`);
console.log(`  Date:        ${issuedDate}`);
console.log(`  URL:         https://cristio.ru/degrees/${slug}/`);
console.log(`\nNext: Run 'npm run build' to generate the static pages.`);
