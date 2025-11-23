export const addMissionRequestDto = (body, params) => {
  return {
    storeId: parseInt(params.storeId),
    endAt: body.endAt,
    goal: body.goal,
    reward: body.reward,
  };
};
export const addMissionResponseDto = (data) => {
  return {
    id: data.id,
    createdAt: data.createdAt,
  };
};

export const acceptMissionRequestDto = (body, params) => {
  return {
    userId: body.userId,
    missionId: parseInt(params.missionId),
  };
};
export const acceptMissionResponseDto = (data) => {
  return {
    id: data.id,
    acceptedAt: data.acceptedAt,
  };
};
export const getMissionsRequestDto = (params, query) => {
  return {
    storeId: parseInt(params.storeId),
    cursor: parseInt(query.cursor) || 0,
  };
};
export const getMissionsResponseDto = (data) => {
  return data;
};
export const getMyMissionsRequestDto = (body, query) => {
  return {
    userId: parseInt(body.userId),
    cursor: parseInt(query.cursor) || 0,
  };
};
export const getMyMissionsResponseDto = (data) => {
  return data;
};
export const completeMissionRequestDto = (body) => {
  return {
    code: body.code,
  };
};
export const completeMissionResponseDto = (data) => {
  return {
    id: data.id,
    completedAt: data.completedAt,
  };
};
