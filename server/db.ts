import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use external Neon database URL
const databaseUrl = "postgresql://neondb_owner:npg_ug7BxMymjEi2@ep-falling-moon-ab4tpdl3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log("Database URL:", databaseUrl.substring(0, 50) + "...");

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
