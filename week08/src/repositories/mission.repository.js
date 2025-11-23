import { prisma } from "../db.config.js";
import crypto from "crypto";

export const createMission = async (data) => {
  const mission = await prisma.mission.create({
    data: {
      restaurantId: data.storeId,
      endAt: new Date(new Date(data.endAt).getTime() + 9 * 60 * 60 * 1000),
      goal: data.goal,
      reward: data.reward,
    },
  });
  return mission.id;
};
export const findMissionById = async (id) => {
  const mission = await prisma.mission.findFirst({
    where: {
      id: id,
    },
  });
  return mission;
};

export const findAcceptedMissionByMissionId = async (missionId, userId) => {
  const acceptedMission = await prisma.acceptedMission.findFirst({
    where: {
      missionId: missionId,
      userId: userId,
    },
  });
  return acceptedMission;
};

export const findAcceptedMissionById = async (id) => {
  const acceptedMission = await prisma.acceptedMission.findFirst({
    where: {
      id: id,
    },
  });
  return acceptedMission;
};

export const createAcceptMission = async (data) => {
  const acceptedMission = await prisma.acceptedMission.create({
    data: {
      userId: data.userId,
      missionId: data.missionId,
      verificationCode: crypto
        .randomInt(0, 1000000000)
        .toString()
        .padStart(9, "0"),
    },
  });
  return acceptedMission.id;
};
export const findMissionsByRestaurantId = async (data) => {
  const missions = await prisma.mission.findMany({
    where: {
      restaurantId: data.storeId,
      endAt: { gt: new Date() },
      id: { gt: data.cursor },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });
  return missions;
};
export const findMissionsByUserId = async (data) => {
  const missions = await prisma.acceptedMission.findMany({
    select: {
      mission: {
        select: {
          reward: true,
          goal: true,
          endAt: true,
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
      acceptedAt: true,
      id: true,
    },
    where: {
      completedAt: null,
      id: { gt: data.cursor },
      userId: data.userId,
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });
  return missions;
};
export const completeMissionByCode = async (data) => {
  const isExists = await prisma.acceptedMission.findFirst({
    select: {
      id: true,
    },
    where: {
      verificationCode: data.code,
    },
  });
  if (isExists == null) return null;

  const mission = prisma.acceptedMission.update({
    data: {
      completedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    },
    where: {
      id: isExists.id,
    },
  });
  return mission;
};
