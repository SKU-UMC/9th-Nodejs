import {
  acceptMissionResponseDto,
  addMissionResponseDto,
} from "../dtos/mission.dto.js";
import {
  createAcceptMission,
  createMission,
  findAcceptedMissionById,
  findAcceptedMissionByMissionId,
  findMissionById,
} from "../repositories/mission.repository.js";
import { findStoreById } from "../repositories/store.repository.js";

export const addMission = async (data) => {
  const isStoreExist = (await findStoreById(data.storeId)) != null;
  if (!isStoreExist) throw new Error("존재하지 않는 식당 입니다.");
  const missionId = await createMission(data);
  const createdMission = await findMissionById(missionId);
  return addMissionResponseDto(createdMission);
};

export const acceptMission = async (data) => {
  const isMissionExist = await findMissionById(data.missionId);
  if (!isMissionExist) throw new Error("존재하지 않는 미션 입니다.");
  const isAlreadyAccepted = await findAcceptedMissionByMissionId(
    data.missionId,
    data.userId
  );
  if (isAlreadyAccepted) throw new Error("이미 수락한 미션 입니다.");
  const missionId = await createAcceptMission(data);
  const acceptedMission = await findAcceptedMissionById(missionId);
  return acceptMissionResponseDto(acceptedMission);
};
