import { prisma } from "../db.config.js";

export const createStore = async (data) => {
  const store = await prisma.restaurant.create({
    data: {
      name: data.name,
      foodTypeId: data.foodTypeId,
      addressId: data.addressId,
      detailAddress: data.detailAddress,
      openTime: new Date(
        new Date(data.openTime).getTime() + 9 * 60 * 60 * 1000
      ),
      closeTime: new Date(
        new Date(data.closeTime).getTime() + 9 * 60 * 60 * 1000
      ),
    },
  });
  return store.id;
};

export const findStoreById = async (id) => {
  const store = await prisma.restaurant.findFirst({
    where: {
      id: id,
    },
  });
  return store;
};
