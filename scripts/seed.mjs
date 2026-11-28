// Creates the tables (if needed) and loads the seeded recipe catalog.
// Usage: npm run db:seed   (reads DATABASE_URL from .env.local)
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env.local first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const root = path.resolve(import.meta.dirname, '..');

// Splits a .sql file into single statements (the Neon HTTP driver runs one at a time).
// Comment lines are removed first; the seed files do not use semicolons inside strings.
function statements(text) {
  return text
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function runFile(file) {
  const text = await readFile(file, 'utf8');
  for (const statement of statements(text)) {
    await sql.query(statement);
  }
  console.log(`Ran ${path.relative(root, file)}`);
}

await runFile(path.join(root, 'lib', 'schema.sql'));

const seedDir = path.join(root, 'db', 'seeds');
const seedFiles = (await readdir(seedDir))
  .filter((name) => name.endsWith('.sql'))
  .sort();
for (const name of seedFiles) {
  await runFile(path.join(seedDir, name));
}

console.log('Seed complete.');
