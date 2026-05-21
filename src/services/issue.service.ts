import { pool } from "../config/db";
import type { IIssue } from "../interfaces/issues.interface";

const getAllIsueFromDB = async () => {
  const issueResult = await pool.query(`
    SELECT * FROM issues
    `);
  const issues = issueResult.rows;
  if (issues.length === 0) {
    return [];
  }

  //all reporter ids
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  //dynamic placeholder
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

export const issueService = {
  createIssueIntoDB,
  getAllIsueFromDB,
};
