import { StatusCodes } from "http-status-codes";
import {
  addReview,
  getReviews,
  getMyReviews,
} from "../services/review.service.js";
import {
  addReviewRequestDto,
  getReviewsRequestDto,
  getMyReviewsRequestDto,
} from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  const review = await addReview(addReviewRequestDto(req.body, req.params));
  res.status(StatusCodes.CREATED).success(review);
};
export const handleGetReviews = async (req, res, next) => {
  const reviews = await getReviews(getReviewsRequestDto(req.params, req.query));
  res.status(StatusCodes.OK).success(reviews);
};
export const handleGetMyReviews = async (req, res, next) => {
  const reviews = await getMyReviews(
    getMyReviewsRequestDto(req.body, req.query)
  );
  res.status(StatusCodes.OK).success(reviews);
};
