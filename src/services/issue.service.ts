import { pool } from "../config/db";
import type { IIssue } from "../interfaces/issues.interface";

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
};
