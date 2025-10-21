import { pool } from "../db.config.js";

export const createStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [store] = await pool.query(
      `INSERT INTO restaurant (name,food_type_id,address_id,detail_address,open_time,close_time) VALUES (?,?,?,?,?,?);`,
      [
        data.name,
        data.foodTypeId,
        data.addressId,
        data.detailAddress,
        data.openTime,
        data.closeTime,
      ]
    );
    return store.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const findStoreById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [store] = await pool.query(`select * from restaurant where id = ?`, [
      id,
    ]);
    if (store.length == 0) return null;
    return store[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
