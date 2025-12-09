import {
  acceptMissionResponseDto,
  addMissionResponseDto,
  getMissionsResponseDto,
  completeMissionResponseDto,
} from "../dtos/mission.dto.js";
import {
  createAcceptMission,
  createMission,
  findAcceptedMissionById,
  findAcceptedMissionByMissionId,
  findMissionById,
  findMissionsByRestaurantId,
  findMissionsByUserId,
  completeMissionByCode,
} from "../repositories/mission.repository.js";
import { findStoreById } from "../repositories/store.repository.js";

export const addMission = async (data) => {
  const isStoreExist = (await findStoreById(data.storeId)) != null;
  if (!isStoreExist) throw new Error("존재하지 않는 식당 입니다.");
  const missionId = await createMission(data);
  const createdMission = await findMissionById(missionId);
  createdMission.createdAt = new Date(
    new Date(createdMission.createdAt).getTime() + 9 * 60 * 60 * 1000
  ).toISOString();
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
  acceptedMission.acceptedAt = new Date(
    new Date(acceptedMission.acceptedAt).getTime() + 9 * 60 * 60 * 1000
  ).toISOString();
  return acceptMissionResponseDto(acceptedMission);
};
export const getMissions = async (data) => {
  let missions = await findMissionsByRestaurantId(data);
  missions = missions.map((mission) => {
    return {
      id: mission.id,
      createdAt: new Date(
        new Date(mission.createdAt).getTime() + 9 * 60 * 60 * 1000
      ).toISOString(),
      endAt: new Date(new Date(mission.endAt).getTime()).toISOString(),
      goal: mission.goal,
      reward: mission.reward,
    };
  });
  return getMissionsResponseDto(missions);
};
export const getMyMissions = async (data) => {
  let missions = await findMissionsByUserId(data);
  missions = missions.map((mission) => {
    return {
      id: mission.id,
      storeName: mission.mission.restaurant.name,
      acceptedAt: new Date(
        new Date(mission.acceptedAt).getTime() + 9 * 60 * 60 * 1000
      ).toISOString(),
      endAt: new Date(new Date(mission.mission.endAt).getTime()).toISOString(),
      goal: mission.mission.goal,
      reward: mission.mission.reward,
    };
  });
  return missions;
};
export const completeMission = async (data) => {
  const mission = await completeMissionByCode(data);
  if (mission == null) throw new Error("존재하지 않는 인증 코드 입니다.");
  return completeMissionResponseDto(mission);
};
