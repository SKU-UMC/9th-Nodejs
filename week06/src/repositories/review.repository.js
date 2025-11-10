import { prisma } from "../db.config.js";

export const createReview = async (data) => {
  const review = await prisma.review.create({
    data: {
      restaurant: {
        connect: {
          id: data.storeId,
        },
      },
      user: {
        connect: {
          id: data.userId,
        },
      },
      score: data.score,
      content: data.content,
    },
  });
  return review.id;
};
export const findReviewById = async (id) => {
  const review = await prisma.review.findFirst({
    where: {
      id: id,
    },
  });
  return review;
};
export const findReviewsByRestaurantId = async (data) => {
  const reviews = await prisma.review.findMany({
    where: {
      restaurantId: data.storeId,
      deletedAt: null,
      id: { gt: data.cursor },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });
  return reviews;
};
export const findReviewsByUserId = async (data) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      restaurant: {
        select: {
          name: true,
        },
      },
      score: true,
      content: true,
      createdAt: true,
    },
    where: {
      userId: data.userId,
      deletedAt: null,
      id: { gt: data.cursor },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });
  return reviews;
};
