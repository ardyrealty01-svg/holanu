/**
 * HOLANU — Environment Variable Validator
 * 
 * Memastikan variabel environment yang dibutuhkan sudah terisi sebelum build.
 * Jalankan: node scripts/validate-env.js
 * Atau tambahkan ke package.json script "prebuild": "node scripts/validate-env.js"
 */

// ── Variabel yang WAJIB ada untuk build ──────────────
const REQUIRED = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_API_URL',
];

// ── Variabel yang WAJIB ada di production ───────────
const REQUIRED_PROD = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT',
  'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
];

// ── Variabel opsional tapi penting ──────────────────
const OPTIONAL = [
  'NEXT_PUBLIC_SUPPORT_WA',
  'NEXT_PUBLIC_SITE_NAME',
  'GROQ_API_KEY',
];

// ── Validasi ─────────────────────────────────────────
let hasError = false;
const warnings = [];

// Check required
for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`❌  MISSING REQUIRED: ${key}`);
    hasError = true;
  }
}

// Check production required (only warn if in production)
if (process.env.NODE_ENV === 'production') {
  for (const key of REQUIRED_PROD) {
    if (!process.env[key]) {
      console.error(`❌  MISSING PRODUCTION: ${key}`);
      hasError = true;
    }
  }
}

// Check optional
for (const key of OPTIONAL) {
  if (!process.env[key]) {
    warnings.push(key);
  }
}

// ── Output ───────────────────────────────────────────
if (warnings.length) {
  console.warn(`⚠️   Optional env vars not set (features may not work):`);
  warnings.forEach(k => console.warn(`    - ${k}`));
}

if (hasError) {
  console.error('\n🔴  Environment validation FAILED. Set the missing variables before running the app.');
  console.error('    Refer to .env.example for required variables.\n');
  process.exit(1);
} else {
  console.log('✅  Environment variables validated successfully.');
}
