import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from '@next/env'
 
// Load Next.js Dotenv configs
const projectDir = process.cwd()
loadEnvConfig(projectDir)

export default defineConfig({
    dialect: "postgresql",
    schema: "./drizzle/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        user: process.env.POSTGRES_DB_USER,
        host: process.env.POSTGRES_DB_HOST,
        database: process.env.POSTGRES_DB_NAME,
        password: process.env.POSTGRES_DB_PASSWORD,
        port: process.env.POSTGRES_DB_PORT,
        ssl: false, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
    }
});