import { addReviewResponseDto } from "../dtos/review.dto.js";
import {
  createReview,
  findReviewById,
} from "../repositories/review.repository.js";
import { findStoreById } from "../repositories/store.repository.js";

export const addReview = async (data) => {
  const isStoreExist = (await findStoreById(data.storeId)) != null;
  if (!isStoreExist) throw new Error("존재하지 않는 식당 입니다.");
  const reviewId = await createReview(data);
  const createdReview = await findReviewById(reviewId);
  return addReviewResponseDto(createdReview);
};
