import { Pool } from "pg";
import envConfig from "./env";

export const pool = new Pool({
  connectionString: envConfig.CONNECTION_STRING,
});

export const initializeDB = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('contributor', 'maintainer'))
    )
    `,
    );
    console.log("✅ Database connection pool created successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
};
