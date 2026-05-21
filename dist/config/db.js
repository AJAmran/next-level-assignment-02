import { Pool } from "pg";
import envConfig from "./env";
export const pool = new Pool({
    connectionString: envConfig.CONNECTION_STRING,
});
export const initializeDB = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('contributor', 'maintainer'))
    )
    `);
        await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    reporter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_issue_type CHECK (type IN ('bug', 'feature_request')),
    CONSTRAINT chk_issue_status CHECK (status IN ('open', 'in_progress', 'resolved')),
    CONSTRAINT chk_description_length CHECK (char_length(description) >= 20)
      )
      `);
        console.log("✅ Database connection pool created successfully.");
    }
    catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
};
//# sourceMappingURL=db.js.map