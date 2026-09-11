import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env";
import * as schema from "./schema";

/**
 * One pooled connection for the process's lifetime. `postgres.js` manages
 * its own connection pool internally — don't wrap this in a per-request
 * factory the way `QueryClient` is on the frontend.
 */
const client = postgres(env.databaseUrl, { max: env.isDev ? 5 : 20 });

export const db = drizzle(client, { schema });
