export const addStoreRequestDto = (body) => {
  return {
    name: body.name,
    foodTypeId: body.foodType,
    addressId: body.address,
    detailAddress: body.detailAddress,
    openTime: "1970-01-01 " + body.openTime,
    closeTime: "1970-01-01 " + body.closeTime,
  };
};
export const addStoreResponseDto = (data) => {
  return {
    id: data.id,
    name: data.name,
  };
};
