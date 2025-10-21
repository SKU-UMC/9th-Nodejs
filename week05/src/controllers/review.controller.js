import { StatusCodes } from "http-status-codes";
import { addReview } from "../services/review.service.js";
import { addReviewRequestDto } from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  const review = await addReview(addReviewRequestDto(req.body, req.params));
  res.status(StatusCodes.CREATED).success(review);
};
