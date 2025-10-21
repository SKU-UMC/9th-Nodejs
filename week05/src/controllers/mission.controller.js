import { StatusCodes } from "http-status-codes";
import {
  acceptMissionRequestDto,
  addMissionRequestDto,
} from "../dtos/mission.dto.js";
import { acceptMission, addMission } from "../services/mission.service.js";

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
