

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express3 from "express";

// src/config/env.ts
import dotenv from "dotenv";
import { env } from "process";
dotenv.config();
var envConfig = {
  CONNECTION_STRING: env.CONNECTION_STRING,
  PORT: env.PORT || 5e3,
  NODE_ENV: env.NODE_ENV || "development",
  JWT_SECRET_KEY: env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || "1d",
  BCRYPT_SALT_ROUNDS: Number(env.BCRYPT_SALT_ROUNDS || 12)
};
var env_default = envConfig;

// src/utils/sendResponse.ts
var sendResponse = (res, payload) => {
  const responseBody = {
    success: payload.success
  };
  if (payload.message !== void 0) {
    responseBody.message = payload.message;
  }
  if (payload.data !== void 0) {
    responseBody.data = payload.data;
  }
  if (payload.errors !== void 0) {
    responseBody.errors = payload.errors;
  }
  res.status(payload.statusCode).json(responseBody);
};
var sendResponse_default = sendResponse;

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized: Invalid token, please login again";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Unauthorized: Token has expired, please renew your token";
  }
  if (err.code) {
    if (err.code === "23505") {
      statusCode = 400;
      message = err.detail || "Duplicate entry: A record with this value already exists";
    } else if (err.code === "23514") {
      statusCode = 400;
      message = "Bad Request: Provided data violates field constraints";
    } else if (err.code === "23503") {
      statusCode = 400;
      message = "Bad Request: Referenced relation or parent record does not exist";
    } else if (err.code === "23502") {
      statusCode = 400;
      message = `Bad Request: Missing required field (${err.column || "unknown column"})`;
    }
  }
  console.error("Global Error Handler:", {
    name: err.name,
    message: err.message,
    stack: env_default.NODE_ENV === "development" ? err.stack : void 0
  });
  sendResponse_default(res, {
    statusCode,
    success: false,
    message,
    errors: message
  });
};

// src/modules/auth/auth.routes.ts
import express from "express";

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/config/db.ts
import { Pool } from "pg";
var pool = new Pool({
  connectionString: env_default.CONNECTION_STRING
});
var initializeDB = async () => {
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
    `
    );
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    reporter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_issue_type CHECK (type IN ('bug', 'feature_request')),
    CONSTRAINT chk_issue_status CHECK (status IN ('open', 'in_progress', 'resolved')),
    CONSTRAINT chk_description_length CHECK (char_length(description) >= 20)
      )
      `);
    console.log("\u2705 Database connection pool created successfully.");
  } catch (error) {
    console.error("\u274C Database initialization failed:", error);
  }
};

// src/modules/auth/auth.service.ts
import jwt from "jsonwebtoken";

// src/utils/ApiError.ts
var ApiError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/modules/auth/auth.service.ts
var signUp = async (payload) => {
  const { name, email, password, role = "contributor" } = payload;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(env_default.BCRYPT_SALT_ROUNDS)
  );
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};
var login = async (payload) => {
  const { email, password } = payload;
  const Result = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email]
  );
  if (Result.rows.length === 0) {
    throw new ApiError(401, "Invalid email or password");
  }
  const user = Result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const accessToken = jwt.sign(jwtPayload, env_default.JWT_SECRET_KEY, {
    expiresIn: env_default.JWT_EXPIRES_IN
  });
  const { password: _, ...userWithoutPassword } = user;
  return { accessToken, user: userWithoutPassword };
};
var authService = {
  signUp,
  login
};

// src/modules/auth/auth.controller.ts
var signUpUser = async (req, res, next) => {
  try {
    const result = await authService.signUp(req.body);
    if (result) {
      sendResponse_default(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result
      });
    } else {
      sendResponse_default(res, {
        statusCode: 400,
        success: false,
        message: "User creation failed"
      });
    }
  } catch (error) {
    next(error);
  }
};
var loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
};
var authController = {
  signUpUser,
  loginUser
};

// src/modules/auth/auth.routes.ts
var router = express.Router();
router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);
var userRoute = router;

// src/modules/issue/issue.routes.ts
import express2 from "express";

// src/modules/issue/issue.service.ts
var getAllIsueFromDB = async (options) => {
  const { sort = "newest", type, status } = options;
  let queryText = `SELECT * FROM issues`;
  const queryValues = [];
  const whereConditions = [];
  if (type) {
    queryValues.push(type);
    whereConditions.push(`type = $${queryValues.length}`);
  }
  if (status) {
    queryValues.push(status);
    whereConditions.push(`status = $${queryValues.length}`);
  }
  if (whereConditions.length > 0) {
    queryText += ` WHERE ${whereConditions.join(" AND ")}`;
  }
  const orderBy = sort === "oldest" ? "ASC" : "DESC";
  queryText += ` ORDER BY created_at ${orderBy}`;
  const issueResult = await pool.query(queryText, queryValues);
  const issues = issueResult.rows;
  if (issues.length === 0) {
    return [];
  }
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
  const placeholders = reporterIds.map((_, index) => {
    return `$${index + 1}`;
  }).join(", ");
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );
  const users = usersResult.rows;
  const userMap = users.reduce(
    (acc, user) => {
      acc[user.id] = user;
      return acc;
    },
    {}
  );
  const formattedIssues = issues.map((issue) => {
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: userMap[issue.reporter_id] || null,
      created_at: issue.created_at,
      updated_at: issue.updated_at
    };
  });
  return formattedIssues;
};
var getSingleIssueFromDB = async (id) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  if (issueResult.rows.length === 0) {
    throw new ApiError(404, "Issue not found");
  }
  const issue = issueResult.rows[0];
  const reporterId = issueResult.rows[0].reporter_id;
  const userResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id = $1
    `,
    [reporterId]
  );
  const user = userResult.rows[0];
  const formattedIssue = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: user,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  };
  return formattedIssue;
};
var createIssueIntoDB = async (payload) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporter_id]
  );
  return result;
};
var updateIssueIntoDB = async (id, userId, userRole, payload) => {
  const issueCheck = await pool.query(
    `
      SELECT reporter_id, status FROM issues WHERE id = $1
      `,
    [id]
  );
  if (issueCheck.rows.length === 0) {
    throw new ApiError(404, "Issue not found");
  }
  const issue = issueCheck.rows[0];
  if (userRole !== "maintainer") {
    if (issue.reporter_id !== userId) {
      throw new ApiError(
        403,
        "You are not authorized to update this issue"
      );
    }
    if (issue.status !== "open") {
      throw new ApiError(
        409,
        "You can only update issues with open status"
      );
    }
    if (payload.status !== void 0) {
      throw new ApiError(
        403,
        "Only maintainers can update issue status"
      );
    }
  }
  const { title, description, status, type } = payload;
  if (title === void 0 && description === void 0 && status === void 0 && type === void 0) {
    throw new ApiError(400, "Please provide at least one field to update");
  }
  const values = [
    title ?? null,
    description ?? null,
    status ?? null,
    type ?? null,
    id
  ];
  const updatedResult = await pool.query(
    `
    UPDATE issues
    SET title = COALESCE($1, title),
    description = COALESCE($2, description),
    status = COALESCE($3, status),
    type = COALESCE($4, type),
    updated_at = NOW() 
    WHERE id = $5
    RETURNING *
    `,
    values
  );
  return updatedResult.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id = $1
    RETURNING *
    `,
    [id]
  );
  return result.rows[0];
};
var issueService = {
  getAllIsueFromDB,
  getSingleIssueFromDB,
  createIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueFromDB
};

// src/modules/issue/issue.controller.ts
var getAllIssues = async (req, res, next) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issueService.getAllIsueFromDB({
      sort,
      type,
      status
    });
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      data: result || []
    });
  } catch (error) {
    next(error);
  }
};
var getSingleIssue = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await issueService.getSingleIssueFromDB(id);
    if (!result) {
      throw new ApiError(404, "Issue not found");
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createIssue = async (req, res, next) => {
  try {
    const reporter_id = req.user?.id;
    if (!reporter_id) {
      throw new ApiError(401, "Unauthorized");
    }
    const result = await issueService.createIssueIntoDB({
      ...req.body,
      reporter_id
    });
    if (!result.rows || result.rows.length === 0) {
      throw new ApiError(400, "Issue creation failed");
    }
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
var updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      throw new ApiError(401, "Unauthorized");
    }
    const result = await issueService.updateIssueIntoDB(
      id,
      userId,
      userRole,
      req.body
    );
    if (!result) {
      throw new ApiError(404, "Issue not found");
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteIssue = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await issueService.deleteIssueFromDB(id);
    if (!result) {
      throw new ApiError(404, "Issue not found");
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var issueController = {
  getAllIssues,
  getSingleIssue,
  createIssue,
  updateIssue,
  deleteIssue
};

// src/middlewares/auth.middleware.ts
import jwt2 from "jsonwebtoken";
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(401, "Unauthorized access !!!");
      }
      const decodedUser = jwt2.verify(
        token,
        env_default.JWT_SECRET_KEY
      );
      const findUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        decodedUser.id
      ]);
      if (findUser.rows.length === 0) {
        throw new ApiError(401, "Unauthorized access !!!");
      }
      if (!roles.includes(findUser.rows[0].role)) {
        throw new ApiError(403, "Forbidden access !!!");
      }
      req.user = decodedUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/issue/issue.routes.ts
var router2 = express2.Router();
router2.get("/", issueController.getAllIssues);
router2.get("/:id", issueController.getSingleIssue);
router2.post(
  "/",
  authMiddleware("contributor", "maintainer"),
  issueController.createIssue
);
router2.patch(
  "/:id",
  authMiddleware("contributor", "maintainer"),
  issueController.updateIssue
);
router2.delete(
  "/:id",
  authMiddleware("maintainer"),
  issueController.deleteIssue
);
var issueRoute = router2;

// src/app.ts
var app = express3();
app.use(express3.json());
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Issue Tracker API"
  });
});
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    error: `Cannot find ${req.originalUrl} on this server.`
  });
});
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var main = async () => {
  await initializeDB();
  app_default.listen(env_default.PORT, () => {
    console.log(
      `\u{1F680} Server running on port ${env_default.PORT} in ${env_default.NODE_ENV} mode`
    );
  });
};
main();
//# sourceMappingURL=server.js.map