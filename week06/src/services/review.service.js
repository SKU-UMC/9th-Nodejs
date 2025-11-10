import {
  addReviewResponseDto,
  getReviewsResponseDto,
  getMyReviewsResponseDto,
} from "../dtos/review.dto.js";
import {
  createReview,
  findReviewById,
  findReviewsByRestaurantId,
  findReviewsByUserId,
} from "../repositories/review.repository.js";
import { findStoreById } from "../repositories/store.repository.js";

export const addReview = async (data) => {
  const isStoreExist = (await findStoreById(data.storeId)) != null;
  if (!isStoreExist) throw new Error("존재하지 않는 식당 입니다.");
  const reviewId = await createReview(data);
  const createdReview = await findReviewById(reviewId);
  createdReview.createdAt = new Date(
    new Date(createdReview.createdAt).getTime() + 9 * 60 * 60 * 1000
  ).toISOString();
  return addReviewResponseDto(createdReview);
};
export const getReviews = async (data) => {
  let reviews = await findReviewsByRestaurantId(data);
  reviews = reviews.map((review) => {
    return {
      id: review.id,
      score: review.score,
      content: review.content,
      createdAt: new Date(
        new Date(review.createdAt).getTime() + 9 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
  return getReviewsResponseDto(reviews);
};
export const getMyReviews = async (data) => {
  let reviews = await findReviewsByUserId(data);
  reviews = reviews.map((review) => {
    return {
      id: review.id,
      restautant: review.restaurant.name,
      score: review.score,
      content: review.content,
      createdAt: new Date(
        new Date(review.createdAt).getTime() + 9 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
  return getMyReviewsResponseDto(reviews);
};
