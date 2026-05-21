import jwt, {} from "jsonwebtoken";
import envConfig from "../config/env";
import { pool } from "../config/db";
import { ApiError } from "../utils/ApiError";
export const authMiddleware = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(401, "Unauthorized access !!!");
            }
            const decodedUser = jwt.verify(token, envConfig.JWT_SECRET_KEY);
            // find user into database
            const findUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
                decodedUser.id,
            ]);
            if (findUser.rows.length === 0) {
                throw new ApiError(401, "Unauthorized access !!!");
            }
            if (!roles.includes(findUser.rows[0].role)) {
                throw new ApiError(403, "Forbidden access !!!");
            }
            req.user = decodedUser;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=auth.middleware.js.map