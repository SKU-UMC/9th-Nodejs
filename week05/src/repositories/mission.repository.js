import { pool } from "../db.config.js";

export const createMission = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [mission] = await pool.query(
      `INSERT INTO mission (restaurant_id,end_at,goal,reward) VALUES (?,?,?,?)`,
      [data.storeId, data.endAt, data.goal, data.reward]
    );
    return mission.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
export const findMissionById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [mission] = await pool.query(`select * from mission where id=?`, [
      id,
    ]);
    if (mission.length == 0) return null;
    return mission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const findAcceptedMissionByMissionId = async (missionId, userId) => {
  const conn = await pool.getConnection();
  try {
    const [acceptedMission] = await pool.query(
      `select * from accepted_mission where mission_id = ? and user_id = ?`,
      [missionId, userId]
    );
    if (acceptedMission.length == 0) return null;
    return acceptedMission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const findAcceptedMissionById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [accepted_mission] = await pool.query(
      `select * from accepted_mission where id = ?`,
      [id]
    );
    if (accepted_mission.length == 0) return null;
    return accepted_mission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const createAcceptMission = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [acceptedMission] = await pool.query(
      `insert into accepted_mission (mission_id, user_id) values (?,?)`,
      [data.missionId, data.userId]
    );
    return acceptedMission.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
