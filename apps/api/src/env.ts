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

export const env = {
  /** Port the HTTP server binds to. */
  port: int("API_PORT", 3001),
  /**
   * Origins allowed to call this API from a browser (CORS). The Next.js dev
   * server and its typical production origin belong here.
   */
  allowedOrigins: list("API_ALLOWED_ORIGINS", ["http://localhost:3000"]),
  /** `development` relaxes CORS to reflect any origin; never set in prod. */
  nodeEnv: Bun.env.NODE_ENV ?? "development",
} as const;

export const isDev = env.nodeEnv !== "production";
