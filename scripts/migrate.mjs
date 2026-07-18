import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

if (process.env.VERCEL) {
  // Vercel builds (production and every PR preview) share this script via the
  // prebuild hook. Auto-pushing schema migrations from a build container isn't
  // safe here — concurrent preview builds could race against each other and
  // against prod. Run `pnpm db:migrate` locally/in CI before deploying instead.
  console.log('[migrate] Running on Vercel — skipping automatic migrations.');
  process.exit(0);
}

const envPath = new URL('../.env.local', import.meta.url);
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;
const poolerHost = process.env.SUPABASE_DB_POOLER_HOST;

if (!supabaseUrl || !dbPassword || dbPassword.startsWith('your-')) {
  console.log('[migrate] Supabase not configured (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in .env.local) — skipping migrations.');
  process.exit(0);
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

// Accept either a bare host (aws-0-us-east-1.pooler.supabase.com) or a full
// connection string pasted from the dashboard — pull just the hostname out of either.
function extractPoolerHost(value) {
  if (!value || value.startsWith('your-')) return null;
  if (value.includes('://')) {
    try {
      return new URL(value).hostname;
    } catch {
      return null;
    }
  }
  return value;
}

const resolvedPoolerHost = extractPoolerHost(poolerHost);

// Port 5432 on the pooler host is "session" mode (one server connection per
// client, safe for prepared statements). Port 6543 is "transaction" mode,
// which multiplexes connections and collides on prepared statement names —
// migration/status commands hit that as `prepared statement already exists`.
const dbUrl = resolvedPoolerHost
  ? `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${resolvedPoolerHost}:5432/postgres`
  : `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`;

const result = spawnSync(
  'pnpm',
  ['exec', 'supabase', 'db', 'push', '--db-url', dbUrl, '--include-all', '--yes'],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
