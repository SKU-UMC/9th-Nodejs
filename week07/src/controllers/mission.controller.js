import { StatusCodes } from "http-status-codes";
import {
  acceptMissionRequestDto,
  addMissionRequestDto,
  getMissionsRequestDto,
  getMyMissionsRequestDto,
  completeMissionRequestDto,
} from "../dtos/mission.dto.js";
import {
  acceptMission,
  addMission,
  getMissions,
  getMyMissions,
  completeMission,
} from "../services/mission.service.js";

export const handleAddMission = async (req, res, next) => {
  const mission = await addMission(addMissionRequestDto(req.body, req.params));
  res.status(StatusCodes.CREATED).success(mission);
};

export const handleAcceptMission = async (req, res, next) => {
  const acceptedMission = await acceptMission(
    acceptMissionRequestDto(req.body, req.params)
  );
  res.status(StatusCodes.ACCEPTED).success(acceptedMission);
};
export const handleGetMissions = async (req, res, next) => {
  const missions = await getMissions(
    getMissionsRequestDto(req.params, req.query)
  );
  res.status(StatusCodes.OK).success(missions);
};
export const handleMyMissions = async (req, res, next) => {
  const missions = await getMyMissions(
    getMyMissionsRequestDto(req.body, req.query)
  );
  res.status(StatusCodes.OK).success(missions);
};
export const handleCompleteMission = async (req, res, next) => {
  const mission = await completeMission(completeMissionRequestDto(req.body));
  res.status(StatusCodes.ACCEPTED).success(mission);
};
