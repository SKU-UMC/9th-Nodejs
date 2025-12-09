export const addReviewRequestDto = (body, params, user) => {
  return {
    storeId: parseInt(params.storeId),
    score: body.score,
    content: body.content,
    userId: user.id,
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
export const getMyReviewsRequestDto = (user, query) => {
  return {
    userId: parseInt(user.id),
    cursor: parseInt(query.cursor) || 0,
  };
};
export const getMyReviewsResponseDto = (data) => {
  return data;
};
