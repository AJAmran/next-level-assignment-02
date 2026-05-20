import bcrypt from "bcrypt";
import envConfig from "../config/env";
import { pool } from "../config/db";

const signUp = async (payload: any) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, Number(envConfig.BCRYPT_SALT_ROUNDS));

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );
  console.log(result);
  return result;
};

export const authService = {
  signUp,
};
