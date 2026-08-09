import { getDbConnection } from "./db";

export interface SummaryRecord {
  id: string;
  user_id: string;
  title: string | null;
  original_file_url: string;
  summary_text: string;
  status: string;
  created_at: string;
  updated_at: string;
  file_name: string | null;
}

export interface SummaryDetailRecord extends SummaryRecord {
  word_count: number;
}

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();

  const summaries =
    await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;

  return summaries as SummaryRecord[];
}

export async function getSummaryById(id: string) {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`SELECT
    id,
    user_id,
    title,
    original_file_url,
    summary_text,
    status,
    created_at,
    updated_at,
    file_name,
    LENGTH(summary_text)-LENGTH(REPLACE(summary_text, ' ', ''))+1 as word_count FROM pdf_summaries WHERE id = ${id}`;

    return summary as SummaryDetailRecord | undefined;
  } catch (error) {
    console.error("Error fetching summary by id", error);
    return null;
  }
}


export async function getUserUploadCount(userId: string) {
  const sql = await getDbConnection();
  try {
    const [result] = await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id = ${userId}`;
    return result?.count || 0;
  } catch (error) {
    console.error("Error fetching user upload count", error);
    return 0;
  }
}
