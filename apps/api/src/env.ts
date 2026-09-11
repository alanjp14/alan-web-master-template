/**
 * Runtime configuration, read once at process start. Every value has a
 * development-friendly default so `bun dev` needs no `.env` file; production
 * deployments set the real values in the host environment.
 */

function int(name: string, fallback: number): number {
  const raw = Bun.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`Environment variable ${name} must be a non-negative integer, got: ${raw}`);
  }
  return n;
}

function list(name: string, fallback: string[]): string[] {
  const raw = Bun.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function required(name: string, devFallback: string, isDev: boolean): string {
  const raw = Bun.env[name];
  if (raw !== undefined && raw !== "") return raw;
  if (isDev) return devFallback;
  throw new Error(
    `Environment variable ${name} is required in production. See apps/api/.env.example.`,
  );
}

const nodeEnv = Bun.env.NODE_ENV ?? "development";
const isDev = nodeEnv !== "production";

export const env = {
  /** Port the HTTP server binds to. */
  port: int("API_PORT", 3001),
  /**
   * Origins allowed to call this API from a browser (CORS) and, for Better
   * Auth, allowed to receive its session cookie. The Next.js dev server and
   * its production origin belong here.
   */
  allowedOrigins: list("API_ALLOWED_ORIGINS", ["http://localhost:3000"]),
  /** `development` relaxes CORS to reflect any origin; never set in prod. */
  nodeEnv,
  isDev,
  /** Postgres connection string. A local dev default only — never in prod. */
  databaseUrl: required(
    "DATABASE_URL",
    "postgres://app:app@localhost:55432/app",
    isDev,
  ),
  /**
   * Signs and encrypts session tokens. Generate with `openssl rand -base64
   * 32`; a fixed dev-only value keeps `bun dev` working with no `.env`, but
   * every deployment (including two dev machines sharing a database) needs
   * its own real secret — anyone with this value can forge sessions.
   */
  authSecret: required(
    "BETTER_AUTH_SECRET",
    "dev-only-secret-do-not-use-in-production",
    isDev,
  ),
  /** This API's own public origin — Better Auth uses it to build cookie/callback URLs. */
  authBaseUrl: required("API_PUBLIC_URL", "http://localhost:3001", isDev),
} as const;
