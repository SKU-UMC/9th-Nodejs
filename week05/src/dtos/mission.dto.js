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
    createdAt: data.created_at,
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
    acceptedAt: data.accepted_at,
  };
};
