export const addReviewRequestDto = (body, params) => {
  return {
    storeId: parseInt(params.storeId),
    score: body.score,
    content: body.content,
    userId: body.userId,
  };
};
export const addReviewResponseDto = (data) => {
  return {
    id: data.id,
    createdAt: data.createdAt,
  };
};
export const getReviewsRequestDto = (params, query) => {
  return {
    storeId: parseInt(params.storeId),
    cursor: parseInt(query.cursor) || 0,
  };
};
export const getReviewsResponseDto = (data) => {
  return data;
};
export const getMyReviewsRequestDto = (body, query) => {
  return {
    userId: parseInt(body.userId),
    cursor: parseInt(query.cursor) || 0,
  };
};
export const getMyReviewsResponseDto = (data) => {
  return data;
};
