import { apiUrl, type ApiError, type ApiRouteName } from "@app/shared";

/**
 * Thin client for the Bun API (`@app/api`). One place that knows the API's
 * origin and how it reports errors; feature code calls `apiFetch("stats")`
 * and gets back a typed payload or a thrown `ApiRequestError`.
 */

/**
 * Origin of the API. `NEXT_PUBLIC_API_URL` is read at build time and inlined
 * into the browser bundle (see `.env.example`); the default matches
 * `@app/api`'s dev port so `pnpm dev` works with no configuration.
 */
export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ApiError).error?.message === "string"
  );
}

/** Fetch a known API route and parse it as `T`, or throw `ApiRequestError`. */
export async function apiFetch<T>(
  route: ApiRouteName,
  init?: RequestInit,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(API_ORIGIN, route), {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiRequestError(
      `Could not reach the API at ${API_ORIGIN}. Is @app/api running?`,
      0,
      "network",
    );
  }

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message = isApiError(body) ? body.error.message : res.statusText;
    const code = isApiError(body) ? body.error.code : "http_error";
    throw new ApiRequestError(message, res.status, code);
  }

  return body as T;
}
