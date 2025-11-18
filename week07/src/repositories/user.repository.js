import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      email: data.email,
    },
  });
  if (user != null) return null;
  const result = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      addressId: data.address,
      detailAddress: data.detailAddress,
      phone: data.phoneNumber,
      password: data.password,
    },
  });
  return result.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (user == null) return null;
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.favoriteFood.create({
    data: {
      foodTypeId: foodCategoryId,
      userId: userId,
    },
  });
  return;
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.favoriteFood.findMany({
    select: {
      foodType: {
        select: {
          typeName: true,
        },
      },
    },
    where: {
      userId: userId,
    },
    orderBy: {
      foodTypeId: "asc",
    },
  });
  return preferences;
};
