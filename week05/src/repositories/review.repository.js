import { pool } from "../db.config.js";

export const createReview = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [review] = await pool.query(
      `INSERT INTO review (restaurant_id,score,content) VALUES (?,?,?)`,
      [data.storeId, data.score, data.content]
    );
    return review.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
export const findReviewById = async (id) => {
  const conn = await pool.getConnection();

  try {
    const [review] = await pool.query(`select * from review where id = ?`, [
      id,
    ]);
    if (review.length == 0) return null;
    return review[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
