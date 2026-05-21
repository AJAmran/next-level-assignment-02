import bcrypt from "bcrypt";
import envConfig from "../config/env";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
const signUp = async (payload) => {
    const { name, email, password, role } = payload;
    const hashedPassword = await bcrypt.hash(password, Number(envConfig.BCRYPT_SALT_ROUNDS));
    const result = await pool.query(`
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hashedPassword, role]);
    console.log(result);
    return result.rows[0];
};
const login = async (payload) => {
    const { email, password } = payload;
    //check user exist or not
    const Result = await pool.query(`
    SELECT * FROM users WHERE email = $1
    `, [email]);
    if (Result.rows.length === 0) {
        throw new Error("User not found");
    }
    const user = Result.rows[0];
    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    // generate token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };
    const accessToken = jwt.sign(jwtPayload, envConfig.JWT_SECRET_KEY, {
        expiresIn: envConfig.JWT_EXPIRES_IN,
    });
    const { password: _, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
};
export const authService = {
    signUp,
    login,
};
//# sourceMappingURL=auth.service.js.map