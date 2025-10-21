export const addReviewRequestDto = (body, params) => {
  return {
    storeId: parseInt(params.storeId),
    score: body.score,
    content: body.content,
  };
};
export const addReviewResponseDto = (data) => {
  return {
    id: data.id,
    createdAt: data.created_at,
  };
};
