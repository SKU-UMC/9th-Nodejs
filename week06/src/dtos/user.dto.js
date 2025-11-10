export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수
    password: body.password,
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택
    detailAddress: body.detailAddress || "", //선택
    phoneNumber: body.phoneNumber, //필수
    preferences: body.preferences, // 필수
  };
};

export const responseFromUser = (data) => {
  return {
    id: data.user.id,
    createdAt: data.user.created_at,
    preferences: data.preferencesMapped,
  };
};
