import { addStoreResponseDto } from "../dtos/store.dto.js";
import {
  createStore,
  findStoreById,
} from "../repositories/store.repository.js";

export const addStore = async (data) => {
  const storeId = await createStore(data);
  const addedStore = await findStoreById(storeId);
  return addStoreResponseDto(addedStore);
};
