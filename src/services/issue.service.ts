import { pool } from "../config/db";
import type {
  IIssue,
  IIssueQueryOptions,
} from "../interfaces/issues.interface";
import { ApiError } from "../utils/ApiError";

const getAllIsueFromDB = async (options: IIssueQueryOptions) => {
  const { sort = "newest", type, status } = options;

  let queryText = `SELECT * FROM issues`;
  const queryValues: string[] = [];
  const whereConditions: string[] = [];

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

  //?all reporter ids
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  //?dynamic placeholder
  const placeholders = reporterIds
    .map((_, index) => {
      return `$${index + 1}`;
    })
    .join(", ");

  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds,
  );

  const users = usersResult.rows;
  const userMap = users.reduce(
    (acc, user) => {
      acc[user.id] = user;
      return acc;
    },
    {} as Record<number, { id: number; name: string; role: string }>,
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
      updated_at: issue.updated_at,
    };
  });

  return formattedIssues;
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1`,
    [id],
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
    [reporterId],
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
    updated_at: issue.updated_at,
  };

  return formattedIssue;
};

const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporter_id],
  );
  return result;
};

const updateIssueIntoDB = async (
  id: string,
  userId: number,
  userRole: string,
  payload: Partial<IIssue>,
) => {
  const issueCheck = await pool.query(
    `
      SELECT reporter_id, status FROM issues WHERE id = $1
      `,
    [id],
  );

  if (issueCheck.rows.length === 0) {
    throw new ApiError(404, "Issue not found");
  }

  const issue = issueCheck.rows[0];

  if (userRole !== "maintainer") {
    // Must be issue owner
    if (issue.reporter_id !== userId) {
      throw new ApiError(
        409,
        "You are not authorized to update this issue",
      );
    }

    // Can update only if status is open
    if (issue.status !== "open") {
      throw new ApiError(
        403,
        "You can only update issues with open status",
      );
    }

    // Contributor cannot update status
    if (payload.status !== undefined) {
      throw new ApiError(
        403,
        "Only maintainers can update issue status",
      );
    }
  }

  const { title, description, status, type } = payload;
  if (
    title === undefined &&
    description === undefined &&
    status === undefined &&
    type === undefined
  ) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const values: (string | number | null)[] = [
    title ?? null,
    description ?? null,
    status ?? null,
    type ?? null,
    id,
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
    values,
  );

  return updatedResult.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

export const issueService = {
  getAllIsueFromDB,
  getSingleIssueFromDB,
  createIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
