const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');

function abs(relPath) {
  return path.join(root, relPath);
}

function exists(relPath) {
  return fs.existsSync(abs(relPath));
}

function read(relPath) {
  return fs.readFileSync(abs(relPath), 'utf8');
}

function walk(relPath) {
  const base = abs(relPath);

  if (!fs.existsSync(base)) {
    return [];
  }

  const entries = fs.readdirSync(base, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryRel = path.join(relPath, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.expo') {
      return [];
    }

    return entry.isDirectory() ? walk(entryRel) : [entryRel];
  });
}

function pass(id, message, file) {
  return { id, ok: true, message, file };
}

function fail(id, message, file) {
  return { id, ok: false, message, file };
}

function requireFiles(files, prefix) {
  return files.map((file, index) => (exists(file) ? pass(`${prefix}_${index + 1}`, `Found ${file}`, file) : fail(`${prefix}_${index + 1}`, `Missing ${file}`, file)));
}

function requireContains(file, values, prefix) {
  if (!exists(file)) {
    return [fail(`${prefix}_FILE`, `Missing ${file}`, file)];
  }

  const text = read(file);
  return values.map((value, index) =>
    text.includes(value)
      ? pass(`${prefix}_${index + 1}`, `${file} contains ${value}`, file)
      : fail(`${prefix}_${index + 1}`, `${file} must contain ${value}`, file),
  );
}

function complete(name, checks) {
  const issues = checks.filter((check) => !check.ok);
  const result = {
    name,
    status: issues.length ? 'failed' : 'passed',
    summary: {
      passed: checks.length - issues.length,
      failed: issues.length,
    },
    issues,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exitCode = issues.length ? 1 : 0;
}

module.exports = {
  abs,
  complete,
  exists,
  fail,
  pass,
  read,
  requireContains,
  requireFiles,
  root,
  walk,
};
