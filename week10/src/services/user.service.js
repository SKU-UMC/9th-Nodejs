import { responseFromUser, modifyMyInfoResponseDto } from "../dtos/user.dto.js";
import bcrypt from "bcrypt";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  modifyUser,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../Error.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    password: await bcrypt.hash(data.password, await bcrypt.genSalt(10)),
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);
  const preferencesMapped = preferences.map((type) => type.foodType.typeName);

  return responseFromUser({ user, preferencesMapped });
};
export const modifyMyInfo = async (data) => {
  if (data.data.password)
    data.data.password = await bcrypt.hash(
      data.data.password,
      await bcrypt.genSalt(10)
    );
  for (const key in data.data) {
    if (data.data[key] === null) {
      delete data.data[key];
    }
  }
  const user = await modifyUser(data);
  return modifyMyInfoResponseDto(data);
};
